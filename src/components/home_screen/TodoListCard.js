import React from 'react';

class TodoListCard extends React.Component {

    render() {
        "const { Wireframes } = this.props;"
        console.log("TodoListCard, todoList.id: " + this.props.Wireframe.title);
        return (
            <div className="card z-depth-2 rounded grey lighten-4 todo-list-link hoverable">
                <div className="card-content grey-text text-darken-4 item_card">
                    <span className="card-title">{this.props.Wireframe.title}</span>
                </div>
            </div>
        );
    }
}
export default TodoListCard;