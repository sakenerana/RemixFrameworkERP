import { useEffect, useState } from 'react';
import { Alert } from 'antd';

export default function MovingAttentionAlert () {
    const [position, setPosition] = useState('translate-x-full');

    useEffect(() => {
        // Start animation after component mounts
        setPosition('translate-x-0');

        // Optional: Reset animation after it completes
        const timer = setTimeout(() => {
            setPosition('translate-x-full');
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed top-14 right-0 z-50 transition-transform duration-1000 ease-in-out ${position}`}>
            <Alert
                message="A warm welcome from IT Department."
                type="success"
                showIcon
                className="shadow-lg rounded-lg w-[300px]"
            />
        </div>
    );
};
