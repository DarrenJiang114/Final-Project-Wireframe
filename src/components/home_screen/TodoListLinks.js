import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TodoListCard from './TodoListCard';
import WireframeJson from '../../test/WireframeData.json';
class TodoListLinks extends React.Component {
    render() {
        const Wireframes = WireframeJson;
        console.log(Wireframes);
        return (
            <div className="todo-lists section">
                {Wireframes && Wireframes.map(Wireframe => (
                    <Link to={{pathname: ('/Wireframe/' + Wireframe.title), Wireframe: {Wireframe}}}>
                        <TodoListCard Wireframe={Wireframe} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        Wireframes: state.firestore.ordered.Wireframes,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(TodoListLinks);