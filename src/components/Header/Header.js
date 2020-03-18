import React, { Component } from 'react';
import './Header.css'

class Header extends Component {

    header = () => {
        return(
            <div>
                <div className="header">
                    <a href="#home" className="logo">
                        Smart X-Ray
                    </a>
                </div>
            </div>
        )
    }

    render() {
        return this.header();
    }
}

export default Header;