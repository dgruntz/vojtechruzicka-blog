import React from "react";

import {rhythm} from "../utils/typography";

class Bio extends React.Component {

    render() {

        return (<gcse:search></gcse:search>)
    }

    componentDidMount() {
        if(window) {
            var cx = '002069634167807847471:b-ekwugobes';
            var gcse = document.createElement('script');
            gcse.type = 'text/javascript';
            gcse.async = true;
            gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gcse, s);
        }
    }

    handleSearchIconClick() {
        this.searchInput.focus();
    }
}

export default Bio;
