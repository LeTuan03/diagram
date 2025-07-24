import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import TinhTest_v2 from "../tab5/geoData/TinhTest_v2.json";
import Phuongxa8TinhNamBo_WGS84_v2 from "../tab5/geoData/phuongxa8TinhNamBo_WGS84_v2.json";

const Map3D: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const [provinceData, setProvinceData] = useState<any>(null);
    const [wardData, setWardData] = useState<any>(null);
    const [showDataInput, setShowDataInput] = useState(true);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [cameraMode, setCameraMode] = useState<'orbit' | 'free'>('orbit');
    const [showWards, setShowWards] = useState(false);
    const meshesRef = useRef<THREE.Group>(new THREE.Group());
    const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
    const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

    const handleProvinceDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            const data = JSON.parse(event.target.value);
            setProvinceData(data);
        } catch (error) {
            console.error('Invalid JSON format for province data');
        }
    };

    const handleWardDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            const data = JSON.parse(event.target.value);
            setWardData(data);
        } catch (error) {
            console.error('Invalid JSON format for ward data');
        }
    };

    const loadSampleData = () => {
        const sampleProvinces = TinhTest_v2;

        const sampleWards = Phuongxa8TinhNamBo_WGS84_v2;

        setProvinceData(sampleProvinces);
        setWardData(sampleWards);
        setShowDataInput(false);
    };

    // Convert GeoJSON coordinates to 3D world coordinates
    const geoToWorld = (coordinates: number[][]) => {
        const points: THREE.Vector3[] = [];
        coordinates.forEach(coord => {
            const [lng, lat] = coord;
            // Simple conversion - in reality you'd use proper projection
            const x = (lng - 106) * 50; // Center around Vietnam
            const z = -(lat - 16) * 50; // Invert Z for proper orientation
            points.push(new THREE.Vector3(x, 0, z));
        });
        return points;
    };

    // Create extruded geometry from polygon
    const createExtrudedGeometry = (coordinates: number[][], height: number) => {
        const points = geoToWorld(coordinates);
        const shape = new THREE.Shape();

        if (points.length > 0) {
            shape.moveTo(points[0].x, points[0].z);
            for (let i = 1; i < points.length; i++) {
                shape.lineTo(points[i].x, points[i].z);
            }
        }

        const extrudeSettings = {
            depth: height,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.2,
            bevelThickness: 0.1
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    // Initialize Three.js scene
    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 50, 100);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        scene.add(ground);

        // Add meshes group to scene
        scene.add(meshesRef.current);

        // Mouse controls
        let isMouseDown = false;
        let previousMousePosition = { x: 0, y: 0 };

        const handleMouseDown = (event: MouseEvent) => {
            isMouseDown = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const handleMouseUp = () => {
            isMouseDown = false;
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (cameraMode === 'free' && isMouseDown) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                const deltaRotationQuaternion = new THREE.Quaternion()
                    .setFromEuler(new THREE.Euler(
                        toRadians(deltaMove.y * 0.5),
                        toRadians(deltaMove.x * 0.5),
                        0,
                        'XYZ'
                    ));

                camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, camera.quaternion);
                previousMousePosition = { x: event.clientX, y: event.clientY };
            }
        };

        const handleWheel = (event: WheelEvent) => {
            const delta = event.deltaY * 0.01;
            camera.position.multiplyScalar(1 + delta);
        };

        const handleClick = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            const intersects = raycasterRef.current.intersectObjects(meshesRef.current.children);

            if (intersects.length > 0) {
                const selectedObject = intersects[0].object as THREE.Mesh;
                const provinceName = selectedObject.userData.name;
                setSelectedProvince(provinceName);
            }
        };

        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('wheel', handleWheel);
        renderer.domElement.addEventListener('click', handleClick);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            if (cameraMode === 'orbit') {
                camera.position.x = Math.cos(Date.now() * 0.0005) * 100;
                camera.position.z = Math.sin(Date.now() * 0.0005) * 100;
                camera.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            renderer.domElement.removeEventListener('mousedown', handleMouseDown);
            renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('wheel', handleWheel);
            renderer.domElement.removeEventListener('click', handleClick);

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [cameraMode]);

    // Helper function
    const toRadians = (angle: number) => angle * (Math.PI / 180);

    // Update 3D meshes when data changes
    useEffect(() => {
        if (!provinceData || !sceneRef.current) return;

        // Clear existing meshes
        meshesRef.current.clear();

        const currentData = showWards && wardData ? wardData : provinceData;

        currentData.features.forEach((feature: any, index: number) => {
            const coords = feature.geometry.coordinates[0];
            const height = showWards ? 2 : Math.sqrt(feature.properties.population || 1000000) * 0.00001;

            try {
                const geometry = createExtrudedGeometry(coords, height);
                const color = new THREE.Color().setHSL(
                    (index * 0.1) % 1,
                    0.7,
                    selectedProvince === feature.properties.name ? 0.3 : 0.5
                );

                const material = new THREE.MeshLambertMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.8
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.userData = { name: feature.properties.name };

                meshesRef.current.add(mesh);
            } catch (error) {
                console.error('Error creating mesh for:', feature.properties.name, error);
            }
        });

    }, [provinceData, wardData, showWards, selectedProvince]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (mountRef.current && cameraRef.current && rendererRef.current) {
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;

                cameraRef.current.aspect = width / height;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(width, height);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const hasData = provinceData || wardData;

    return (
        <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-100 rounded-lg shadow-lg">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Bản đồ 3D Các Tỉnh Việt Nam</h1>
                <p className="text-gray-600">Bản đồ 3D tương tác với các khối tỉnh nổi lên</p>
            </div>

            {showDataInput && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dữ liệu GeoJSON Tỉnh:
                            </label>
                            <textarea
                                rows={8}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm font-mono"
                                placeholder="Paste GeoJSON data for provinces here..."
                                onChange={handleProvinceDataChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dữ liệu GeoJSON Phường/Xã:
                            </label>
                            <textarea
                                rows={8}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm font-mono"
                                placeholder="Paste GeoJSON data for wards here..."
                                onChange={handleWardDataChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={loadSampleData}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Sử dụng dữ liệu mẫu
                        </button>
                        <button
                            onClick={() => setShowDataInput(false)}
                            disabled={!hasData}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                        >
                            Hiển thị bản đồ 3D
                        </button>
                    </div>
                </div>
            )}

            {!showDataInput && hasData && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCameraMode(cameraMode === 'orbit' ? 'free' : 'orbit')}
                                    className={`px-4 py-2 rounded ${cameraMode === 'orbit'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Camera: {cameraMode === 'orbit' ? 'Tự động' : 'Tự do'}
                                </button>
                            </div>
                            {wardData && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowWards(!showWards)}
                                        className={`px-4 py-2 rounded ${showWards
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {showWards ? 'Phường/Xã' : 'Tỉnh'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowDataInput(true)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                Chỉnh sửa dữ liệu
                            </button>
                            <button
                                onClick={() => setSelectedProvince(null)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Bỏ chọn
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Điều khiển:</strong> {cameraMode === 'orbit' ? 'Tự động xoay' : 'Kéo để xoay'} |
                            <strong> Zoom:</strong> Cuộn chuột |
                            <strong> Chọn:</strong> Click vào khối tỉnh |
                            <strong> Chiều cao:</strong> Dựa trên dân số
                        </p>
                    </div>

                    <div
                        ref={mountRef}
                        className="w-full h-96 bg-gray-100 rounded-lg border"
                        style={{ minHeight: '600px' }}
                    />
                </div>
            )}

            {selectedProvince && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {selectedProvince}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {provinceData?.features.find((f: any) => f.properties.name === selectedProvince)?.properties.population?.toLocaleString() || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">Dân số</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {provinceData?.features.find((f: any) => f.properties.name === selectedProvince)?.properties.area?.toLocaleString() || 'N/A'} km²
                            </div>
                            <div className="text-sm text-gray-600">Diện tích</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {provinceData?.features.find((f: any) => f.properties.name === selectedProvince)?.properties.gdp?.toLocaleString() || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">GDP (tỷ VND)</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map3D;