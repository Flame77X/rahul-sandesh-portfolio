import { ReactLenis } from '@studio-freight/react-lenis';
import Scene from '../canvas/Scene';
import AudioController from './AudioController';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <ReactLenis root>
            <Scene />
            <AudioController />
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>
        </ReactLenis>
    );
};

export default Layout;
