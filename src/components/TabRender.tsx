import React, { useState, ReactNode } from 'react';

type Tab = {
    label: string;
    content: ReactNode;
};

type TabRenderProps = {
    tabs: Tab[];
};

const TabRender: React.FC<TabRenderProps> = ({ tabs }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <div style={{ display: 'flex', borderBottom: '1px solid #ccc', maxHeight: '50vh' }}>
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveIndex(idx)}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderBottom: activeIndex === idx ? '2px solid #007bff' : 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: activeIndex === idx ? 'bold' : 'normal',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div style={{ padding: '16px 0' }}>
                {tabs[activeIndex]?.content}
            </div>
        </div>
    );
};

export default TabRender;