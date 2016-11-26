import * as React from 'react';
import { NavMenu } from './NavMenu';

export interface LayoutProps {
    body: React.ReactElement<any>;
}

export class Layout extends React.Component<LayoutProps, void> {
    public render() {
        return (
            <div> 
                <NavMenu/>  
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-sm-12'>
                            { this.props.body }
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}
