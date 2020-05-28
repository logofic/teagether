'use strict';
import TitleComponent from './components/title_component'

const e = React.createElement;

class HeaderContainer extends React.Component {
    render() {
        return e(
            <TitleComponent></TitleComponent>
          );
    }
};

const domContainer = document.querySelector('#header_container');
ReactDOM.render(e(HeaderContainer), domContainer);
