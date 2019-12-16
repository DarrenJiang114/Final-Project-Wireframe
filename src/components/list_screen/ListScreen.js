import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, getFirebase } from 'react-redux-firebase';
import {firebaseConnect} from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {Link} from 'react-router-dom';
import { Modal, Button, icons } from 'react-materialize';
import Draggable, {DraggableCore} from 'react-draggable';
import {Resizable} from 'react-resizable';
import {SketchPicker} from 'react-color';
import { thisExpression } from '@babel/types';
import {Rnd} from 'react-rnd';


class ListScreen extends Component {
    state = {
        modalTrig: "modal-trigger",
        diagram: this.props.location.Wireframe.Wireframe.diagram,
        title: this.props.location.Wireframe.Wireframe.title,
        height: this.props.location.Wireframe.Wireframe.height,
        width: this.props.location.Wireframe.Wireframe.width,
        currentWireFrame: this.props.location.Wireframe.Wireframe,
        newContainer: false,
        tempHeight: "",
        tempWidth: "",
        dimDis: "disabled",
        newButtonText: "text",
        newButtonFont: "13px",
        newButtonBG: "#9e9e9e",
        newButtonBorder: "1px solid #000000",
        newBorderRad: "2px",
        newLabelFont: "15px",
        newContainerWidth: "50",
        newContainerHeight: "50",
        newContainerFill: "#FFFFFF",
        newContainerBorder: "2px solid #000000",
        newContainerRad: "2px",
        newInputVal: "",
        newLabel: "Label:",
        currentControl: null,
        updatedText: "",
        updatedFont: "",
        updatedBG: "#FFFFFF",
        tempColor: "#FFFFFF",
        newBorCol: "#000000",
        newBorThick: "",
        newTextcol: "#000000",
        newFontCol: "#000000",
        updateBorderRad: "",
    }

    sortCriteria = 'none';
    changedTime = false;

    applyDim = () => {
        if ((0 < this.state.tempHeight) && (this.state.tempHeight< 5000)){
            this.setState({height: this.state.tempHeight});
            this.setState({dimDis: "disabled"});
        }
        if ((0<this.state.tempWidth) && (this.state.tempWidth<5000)){
            this.setState({width: this.state.tempWidth});
            this.setState({dimDis: "disabled"});
        }
    }

    handleChange = (e) => {
        const { target } = e;
        console.log("hey");
        if(target.name == "newInput"){
            this.setState({newInputVal: target.value}, () => {});
            this.setState({updatedText: target.value}, () =>{});
        }
        if(target.name == "tempHeight"){
            this.setState({tempHeight: target.value},()=>{
                console.log(this.state.tempHeight);
            });
            if((this.state.tempHeight.length>0) || (this.state.tempWidth.length>0)){
                this.setState({dimDis: "enabled"});
            }
            else{
                this.setState({dimDis: "disabled"});
            }
        }
        if(target.name == "tempWidth"){
            this.setState({tempWidth: target.value},()=>{
                console.log(this.state.tempWidth);
            });
            if((this.state.tempHeight.length>0) || (this.state.tempWidth.length>0)){
                this.setState({dimDis: "enabled"});
            }
            else{
                this.setState({dimDis: "disabled"});
            }
        }
       
        if((target.name == "updatedText") && (this.state.currentControl != null )){
            this.setState({updatedText: target.value},() =>{
                this.setTextChanges();
            });
        }
        if((target.name == "updatedFont")&&(this.state.currentControl != null)){
            this.setState({updatedFont: (target.value + "px")}, () =>{
                this.setFontChanges();
            });       
        }
        if((target.name == "updateThick")&&(this.state.currentControl != null)){
            this.setState({newBorThick: (target.value)}, () => {this.setBorder()});
        }
        if((target.name == "updateRad")&&(this.state.currentControl != null)){
            this.setState({updateBorderRad: (target.value)}, () => this.setRad());
        }  
    }
    setRad = () => {
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        var control = this.state.currentControl;
        var id = control.id;
        var x = control.style.borderRadius;
        x = x.substring(1, x.length);
        x = this.state.updateBorderRad + x;
        document.getElementById(id).style.borderRadius = x;
        for (var i = 0; i< this.state.diagram.length; i++){
            if(this.state.diagram[i].name == control.name){
                this.state.diagram[i].borderRad = x;
            }
        }
    }
    setBorder = () =>{
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        var control = this.state.currentControl;
        var id = control.id;
        var x = control.style.border;
        x = x.substring(1, x.length);
        x = this.state.newBorThick + x;
        document.getElementById(id).style.border = x;
        for (var i = 0; i< this.state.diagram.length; i++){
            if(this.state.diagram[i].name == control.name){
                this.state.diagram[i].border = x;
            }
        }
    }
    setTextChanges = () =>{
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        var control = this.state.currentControl;
        var id = control.id;
        if(id == "newTextfield"){
            document.getElementById(id).childNodes.value = this.state.updatedText;
        }
        else{
            document.getElementById(id).innerText = this.state.updatedText;    
        }
        for (var i = 0; i< this.state.diagram.length; i++){
            if(this.state.diagram[i].name == control.name){
                this.state.diagram[i].innerText = this.state.updatedText;
            }
        }  
    }
    setFontChanges = () =>{
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        var control = this.state.currentControl;
        var id = control.id;
        document.getElementById(id).style.fontSize = this.state.updatedFont;
        for (var i = 0; i< this.state.diagram.length; i++){
            if(this.state.diagram[i].name == control.name){
                this.state.diagram[i].fontSize = this.state.updatedFont;
            }
        }
    }
    duplicate = (e) =>{
        var control = this.state.currentControl;
        if (e.keyCode == 68){
            var clone = control.cloneNode(true);
            var x = control.style.left.substring(0, control.style.left.length-2);
            var y = control.style.top.substring(0, control.style.top.length-2);
            clone.style.top = (parseInt(y, 10) + 100).toString() + "px";
            clone.style.left = (parseInt(x, 10) + 100).toString() + "px";
            document.getElementById("Wireframe").appendChild(clone);
        }
    }
    deleteControl = (e) => {
        var control = this.state.currentControl;
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        console.log(e.keyCode);
        if(e.keyCode == 8){
            console.log("heyo");
            document.getElementById("Wireframe").removeChild(this.state.currentControl);
            for(var i = 0; i < this.state.diagram.length; i++){
                if(this.state.currentControl.name == this.state.diagram[i].name){
                    this.state.diagram.splice(i, 1);
                }
            }
      
            this.setState({currentControl: null});
            this.setState({updatedText: ""});
            this.setState({updatedFont: ""});
            this.setState({updatedBG: "#FFFFFF"});
            this.setState({newBorCol: "#000000"});
            this.setState({newFontCol: "#000000"});
        }
        if(e.keyCode == 17){
            control.addEventListener("keydown", this.duplicate);
        }
    }
    selectControl = (e) =>{
        var control = e.target;
        console.log(control);
        if ((control.id == "newInput") && (control.value.length!=0)){
            return;
        }
        if((e.target.id == "newInput" )|| (e.target.id == "newContainer")){
            control = e.target.parentNode;
        }
        console.log(control.style);
        this.setState({currentControl: control});
        console.log(this.state.currentControl);
        if(control.id == "newContainer2"){
            this.setState({updatedBG: control.style.fill});
            this.setState({newBorThick: control.style.border.substring(0,1)});
            this.setState({newBorCol: control.style.border.substring(10, control.style.border.length)});
            this.setState({updateBorderRad: control.style.borderRadius.substring(0,1)});
        }
        if((e.target.id == "newButton") || (e.target.id == "newLabel")){
            this.setState({updatedText: control.innerText});
            this.setState({updatedFont: control.style.fontSize},() =>{
                console.log(this.state.currentControl);
            });
            this.setState({updatedBG: control.style.backgroundColor});
            this.setState({newBorCol: control.style.border.substring(10, control.style.border.length)});
            this.setState({newFontCol: control.style.color});
            this.setState({newBorThick: control.style.border.substring(0,1)});
            this.setState({updateBorderRad: control.style.borderRadius.substring(0,1)});
        }
        if(this.state.currentControl == control){
            control.addEventListener("keydown", this.deleteControl);
        }
    }
    undoControl = () =>{
        console.log("p");
        this.setState({currentControl: null});
        this.setState({updatedText: ""});
        this.setState({updatedFont: ""});
        this.setState({updatedBG: "#FFFFFF"});
        this.setState({newBorCol: "#000000"});
        this.setState({newFontCol: "#000000"});
    }
    addButton = () =>{
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        var newBTN = document.createElement("button");
        newBTN.id = "newButton";
        newBTN.name = (Math.random() * 1000);
        newBTN.className = "waves-effect waves-light btn-small";
        newBTN.style.position = "relative";
        newBTN.style.fontSize = this.state.newButtonFont;
        newBTN.style.color = this.state.newFontCol;
        newBTN.style.backgroundColor = this.state.newButtonBG;
        newBTN.style.border = this.state.newButtonBorder;
        newBTN.style.borderRadius = this.state.newBorderRad;
        newBTN.style.top = "202px";
        newBTN.style.left = "290px";
        newBTN.innerText = this.state.newButtonText;
        newBTN.addEventListener("click", this.selectControl);
        document.getElementById("Wireframe").appendChild(newBTN);
        this.state.diagram.push({
            control: "button",
            id : newBTN.id,
            className: newBTN.className,
            name: newBTN.name,
            position: newBTN.style.position,
            fontSize: newBTN.style.fontSize,
            fontColor: newBTN.style.color,
            bgColor: newBTN.style.backgroundColor,
            border:  newBTN.style.border,
            borderRad: newBTN.style.borderRadius,
            top: newBTN.style.top,
            left: newBTN.style.left,
            innerText: newBTN.innerText,
        });
        console.log(this.state.diagram);
        
    }

    addContainer = () => {
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        var container = document.createElementNS("http://www.w3.org/2000/svg","svg");
        container.setAttribute("width", this.state.newContainerWidth);
        container.setAttribute("height", this.state.newContainerHeight);
        container.id = "newContainer2";
        container.name = (Math.random() * 1000);
        container.tabIndex = -1
        container.addEventListener("click", this.selectControl);
        container.style.fill = this.state.newContainerFill;
        container.style.border = this.state.newContainerBorder;
        container.style.borderRadius = this.state.newContainerRad;
        container.style.position = "relative";
        container.style.top = "202px";
        container.style.left = "294px";
        var rectangle = document.createElementNS("http://www.w3.org/2000/svg","rect");
        rectangle.id = "newContainer";
        rectangle.setAttribute("width", this.state.newContainerWidth);
        rectangle.setAttribute("height", this.state.newContainerHeight);
        container.appendChild(rectangle);
        console.log(container);
        document.getElementById("Wireframe").appendChild(container);
        this.state.diagram.push({
            control: "container",
            name: container.name,
            tabIndex: -1,
            name: container.name,
            id: container.id,
            position: container.style.position,
            bgColor: container.style.fill,
            border:  container.style.border,
            borderRad: container.style.borderRadius,
            top: container.style.top,
            left: container.style.left,
        });
        console.log(this.state.diagram);
    }
    

    addLabel = () =>{
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        var label = document.createElement("b");
        label.id = "newLabel";
        label.name = (Math.random() * 1000);
        label.tabIndex = -1;
        label.innerText = this.state.newLabel;
        label.style.fontSize = this.state.newLabelFont;
        label.style.cursor = "pointer";
        label.style.position = "relative";
        label.style.top = "202px";
        label.style.left = "293px";
        label.addEventListener("click", this.selectControl);
        document.getElementById("Wireframe").appendChild(label);
        this.state.diagram.push({
            control: "label",
            tabIndex: -1,
            id: label.id,
            name: label.name,
            position: label.style.position,
            innerText: label.innerText,
            cursor: "pointer",
            fontSize: label.style.fontSize,
            top: label.style.top,
            left: label.style.left,
        });
       console.log(this.state.diagram);
    }
    addTextfield = () =>{
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        var textfield = document.createElement("form");
        textfield.id = "newTextfield";
        textfield.className = "text_toolbar";
        textfield.name = (Math.random() * 1000);
        var input = document.createElement("input");
        input.className = "browser-default";
        input.name = "newInput";
        input.id = "newInput";
        input.value = this.state.newInputVal;
        input.type = "text";
        textfield.appendChild(input);
        textfield.style.position = "relative";
        textfield.style.top = "128px";
        textfield.style.left = "271px";
        textfield.style.width= "80px";
        textfield.addEventListener("click", this.selectControl);
        document.getElementById("Wireframe").appendChild(textfield);
        this.state.diagram.push({
            control: "textfield",
            id: textfield.id,
            name: textfield.name,
            className: textfield.className,
            inputClassName: input.className,
            position: textfield.style.position,
            top: textfield.style.top,
            left: textfield.style.left,
            width: textfield.style.width,
            value: input.value,
            inName: input.name,
            type: input.type,
        });
        
    }


    handleColorChange = (color, e) =>{
        console.log(color.hex);
        e.preventDefault();
        this.state.tempColor = color.hex;
    }
    setColor = (e) =>{
        this.setState({modalTrig: "modal-trigger"}, () =>{});
        const {target} = e;
        var control = this.state.currentControl;
        var id = control.id;
        if(target.name == "bg"){
            if(control.id == "newContainer2"){
                this.setState({updatedBG: this.state.tempColor});
                document.getElementById(id).style.fill = this.state.tempColor;
            }
            this.setState({updatedBG: this.state.tempColor});
            console.log(this.state.tempColor);
            document.getElementById(id).style.backgroundColor = this.state.tempColor;
            for (var i = 0; i< this.state.diagram.length; i++){
                if(this.state.diagram[i].name == control.name){
                    this.state.diagram[i].bgColor = this.state.tempColor;
                }
            }
        }
        if(target.name == "bc"){
            console.log(this.state.tempColor);
            this.setState({newBorCol: this.state.tempColor},()=>{});
            var x = control.style.border.substring(0,10);
            x += this.state.tempColor;
            document.getElementById(id).style.border = x;
            for (var i = 0; i< this.state.diagram.length; i++){
                if(this.state.diagram[i].name == control.name){
                    this.state.diagram[i].border = x;
                }
            }
        }
        if(target.name == "tc"){
            this.setState({newTextcol: this.state.tempColor},()=>{console.log(this.state.newTextcol)});
            document.getElementById(id).style.color = this.state.tempColor;
            for (var i = 0; i< this.state.diagram.length; i++){
                if(this.state.diagram[i].name == control.name){
                    this.state.diagram[i].fontColor = this.state.tempColor;
                }
            }
        }
        
    }
    saveChanges = () =>{
        console.log(this.state.diagram);
        this.setState({modalTrig: ""}, () =>{});
        const firestore = getFirestore();
        const firebase = getFirebase();
        firestore.collection("Wireframes").doc(this.state.currentWireFrame.id).update({
            height: this.state.height, width: this.state.width, diagram: this.state.diagram});

    }
    loadChanges = () =>{
        console.log("jelly");
        var diagram = this.state.diagram;
        for (var i = 0; i<diagram.length; i++){
            if (diagram[i].control == "button"){
                var newBTN = document.createElement("button");
                newBTN.id = diagram[i].id;
                newBTN.name = diagram[i].name;
                newBTN.className = diagram[i].className;
                newBTN.style.position = diagram[i].position;
                newBTN.style.fontSize = diagram[i].fontSize;
                newBTN.style.color = diagram[i].fontColor;
                newBTN.style.backgroundColor = diagram[i].bgColor;
                newBTN.style.border = diagram[i].border;
                newBTN.style.borderRadius = diagram[i].borderRad;
                newBTN.style.top = diagram[i].top;
                newBTN.style.left = diagram[i].left;
                newBTN.innerText = diagram[i].innerText;
                newBTN.addEventListener("click", this.selectControl);
                document.getElementById("Wireframe").appendChild(newBTN);
            }
            if(diagram[i].control == "container"){
                var container = document.createElementNS("http://www.w3.org/2000/svg","svg");
                container.setAttribute("width", this.state.newContainerWidth);
                container.setAttribute("height", this.state.newContainerHeight);
                container.name = diagram[i].name;
                container.id = diagram[i].id;
                container.tabIndex = -1
                container.addEventListener("click", this.selectControl);
                container.style.fill = diagram[i].bgColor;
                container.style.border = diagram[i].border;
                container.style.borderRadius = diagram[i].borderRad;
                container.style.position = diagram[i].position;
                container.style.top = diagram[i].top;
                container.style.left = diagram[i].left;
                var rectangle = document.createElementNS("http://www.w3.org/2000/svg","rect");
                rectangle.id = "newContainer";
                rectangle.setAttribute("width", this.state.newContainerWidth);
                rectangle.setAttribute("height", this.state.newContainerHeight);
                container.appendChild(rectangle);
                document.getElementById("Wireframe").appendChild(container);
            }
            if(diagram[i].control == "label"){
                var label = document.createElement("b");
                label.id = diagram[i].id;
                label.tabIndex = -1;
                label.name = diagram[i].name;
                label.innerHTML = diagram[i].innerHTML;
                label.style.fontSize = diagram[i].fontSize;
                label.style.cursor = "pointer";
                label.style.position = diagram[i].position;
                label.style.top = diagram[i].top;
                label.style.left =diagram[i].left;
                label.addEventListener("click", this.selectControl);
                document.getElementById("Wireframe").appendChild(label);
            }
            if(diagram[i].control == "textfield"){
                var textfield = document.createElement("form");
                textfield.id = diagram[i].id;
                textfield.className = diagram[i].id;
                textfield.name = diagram[i].name;
                var input = document.createElement("input");
                input.className = diagram[i].inputClassName;
                input.name = diagram[i].inName;
                input.id = "newInput";
                input.value = diagram[i].value;
                input.type = diagram[i].type;
                textfield.appendChild(input);
                textfield.style.position = diagram[i].position;
                textfield.style.top = diagram[i].top;
                textfield.style.left = diagram[i].left;
                textfield.style.width= diagram[i].width;
                textfield.addEventListener("click", this.selectControl);
                document.getElementById("Wireframe").appendChild(textfield);
            }

        }
    }
    componentDidMount(){
        this.loadChanges();
    }
    ZoomIn =() =>{
        var wf = document.getElementById("Wireframe");
        wf.style.transform = "scale(1.2, 1.2)";
    }
    ZoomOut = () =>{

    }

    render() {
        const auth = this.props.auth;
        console.log(document.getElementById("Wireframe"));
        console.log(this.props.location.Wireframe.Wireframe);
        let Wireframe = this.props.location.Wireframe.Wireframe;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if (!Wireframe){
            return <React.Fragment />
        }
        let LeftRectstyle = {fill: "#FAE5D3" , strokewidth:3 , stroke:"#000000", position: "absolute", 
        top: "100px", left: "10px", zindex: 1};
        let RightRectstyle = {fill: "#FAE5D3" , strokewidth:3 , stroke:"#000000", position: "absolute", 
        top: "100px", left: "800px", zindex: 1};
        let newConStyle = {fill: this.state.newContainerFill, border: this.state.newContainerBorder, position: "relative", top: "202px", left:"302px"}
        let ZoomIn = {position: "relative", z: 1, top: "40px", left: "-140px", cursor: "pointer"}
        let ZoomOut = {position: "relative", z: 1, top: "40px", left: "-145px", cursor: "pointer"}
        let SaveBTN = {position: "relative", z: 1, top: "30px", left: "-140px", font:"6px" }
        let CloseBTN = {position: "relative", z: 1, top: "30px", left: "-140px" }
        let Container = {fill: "#FFFFFF", z: 1, position: "absolute", top: "180px",
        left: "60px"}
        let containerLabel = {position: "absolute", left: "75px", top: "260px", cursor: "pointer"}
        let properties = {position: "absolute", left: "840px", top: "110px"}
        let inputPrompt = {position: "absolute", left: "45px", top: "290px"}
        let label = {position: "absolute", left: "90px", top: "310px", cursor: "pointer"}
        let SubmitBTN = {position: "absolute", z: 1, top: "360px", left: "70px"}
        let btnlabel = {position: "absolute", top: "395px", left: "90px", z: 1, cursor: "pointer"}
        let TextfieldInput = {position: "absolute", z: 1, top: "410px", left: "40px"}
        let textfield = {position: "absolute", z: 1, top: "480px", left: "85px", cursor: "pointer"}
        let propinput = {position: "absolute", z: 1, top: "120px", left: "820px"}
        let fontlabel = {position: "absolute", z: 1, top: "210px", left: "800px"}
        let FontInput = {position: "absolute", z: 1, top: "220px", left: "800px"}
        let label1 = {position: "absolute", z: 1, top: "310px", left: "800px"}
        let label2 = {position: "absolute", z: 1, top: "390px", left: "800px"}
        let label3 = {position: "absolute", z: 1, top: "550px", left: "800px"}
        let label4 = {position: "absolute", z: 1, top: "630px", left: "800px"}
        let label5 = {position: "absolute", z: 1, top: "710px", left: "800px"}
        let label6 = {position: "absolute", z: 1, top: "790px", left: "800px"}
        let TClabel = {position: "absolute", z: 1, top: "470px", left: "800px"}
        let tccircle = {stroke:"#000000 ", strokewidth:"3", fill: this.state.newTextcol, position: "absolute", z: 1, top: "460px", left: "940px", cursor: "pointer"}
        let bgcircle = {stroke:"#000000 ", strokewidth:"3", fill: this.state.updatedBG, position: "absolute", z: 1, top: "300px", left: "940px", cursor: "pointer"}
        let bccircle = {stroke:"#000000 ", strokewidth:"3", fill: this.state.newBorCol, position: "absolute", z: 1, top: "380px", left: "940px", cursor:"pointer"}
        let thickInput = {position: "absolute", z: 1, top: "550px", left: "800px"}
        let radInput = {position: "absolute", z: 1, top: "630px", left: "800px"}
        let WidthInput = {position: "absolute", z: 1, top: "710px", left: "800px"}
        let HeightInput = {position: "absolute", z: 1, top: "790px", left: "800px"}
        let UpdateBTN = {position: "absolute", z: 1, top: "860px", left: "810px"}
        let WireframeStyle = {position: "absolute", zindex : -1, left: "300px", top: "200px",fill: "#FFFFFF", border: "2px solid black"}
        
        let TestStyle = {position: "relative", border: "2px solid black", fill: "#FFFFFF", top: "95px", left: "45px"}
        let modalStyle = {position: "absolute", top: "410px", left: "520px"}
        let modalStyle1 = {position: "absolute", top: "90px", left: "545px"}
        return (
            <div>
                <div id = "leftControl" className="container">
                    <svg width = "255" height = "850" style = {LeftRectstyle}>
                        <rect  width = "220" height = "840"> 
                        </rect> 
                    </svg>
                    <i onClick = {this.ZoomIn} class = "small material-icons" style ={ZoomIn} >zoom_in</i>
                    <i onClick = {this.ZoomOut} class = "small material-icons" style ={ZoomOut} >zoom_out</i>
                    <a class="waves-effect waves-light grey btn-small" 
                    style = {SaveBTN} onClick = {this.saveChanges}>Save</a>
                    <Link to = "/" ><a className={"waves-effect waves-light grey btn-small " + this.state.modalTrig}
                    style = {CloseBTN} data-target = "confirmSave">Close</a>
                    <Modal id = "confirmSave">
                        <b>Do you want to save your changes?</b>
                        <button onClick = {this.saveChanges} style = {modalStyle1}class = "waves-effect waves-teal btn-flat modal-close">Save</button>
                    </Modal>
                    </Link>
                    <svg width = "150" height = "100" style = {Container}>
                        <rect  width = "125" height = "75"> 
                        </rect> 
                    </svg>
                    <b onClick = {this.addContainer} style = {containerLabel}>Container</b>
                    <span style = {inputPrompt}>Prompt for input:</span>
                    <b onClick = {this.addLabel} style = {label}>Label</b>
                    <a class="waves-effect waves-light grey btn-small" 
                    style = {SubmitBTN} onClick = {this.loadChanges}>Submit</a>
                    <b onClick = {this.addButton} style = {btnlabel}>Button</b>
                    <div class = "input-field" style = {TextfieldInput}>
                        <label>input</label>
                        <input className = "active" type= "text" ></input>
                    </div>
                    <b onClick = {this.addTextfield} style = {textfield}>Textfield</b>
                </div>
                <div className="container">
                    <svg width = "270" height = "850" style = {RightRectstyle}>
                        <rect  width = "250" height = "840" />
                    </svg>
                    <span style ={properties}>Properties</span>
                    <div class = "input-field" style = {propinput}> 
                        <input className = "active" type = "text" name = "updatedText" onChange = {this.handleChange} value = {this.state.updatedText}></input>
                    </div>
                    <b style = {fontlabel}>Font Size:</b>
                    <div class = "input-field" style = {FontInput}>
                        <input className = "active" name = "updatedFont" onChange = {this.handleChange} value = {this.state.updatedFont.substring(0,this.state.updatedFont.length-2)} type= "text" ></input>
                    </div>
                    <b style = {label1}>Background:</b>
                    <b style = {label2}>Border Color:</b>
                    <b style = {label3}>Border Thickness:</b>
                    <b style = {label4}>Border Radius:</b>
                    <b style = {TClabel}>Text Color:</b>
                    <svg className = "modal-trigger" data-target = "tcCP"height = "60" width = "60" style = {tccircle}>
                        <circle cx = "25" cy = "25" r = "25"></circle>
                    </svg>
                    <svg className = "modal-trigger" data-target = "bgCP"height = "60" width = "60" style = {bgcircle}>
                        <circle cx = "25" cy = "25" r = "25"></circle>
                    </svg>
                    <Modal id = "tcCP">
                        <SketchPicker onChange = {this.handleColorChange}></SketchPicker>
                        <a style = {modalStyle} name = "tc" onClick = {this.setColor} class="waves-effect waves-light grey btn-small modal-close">apply</a>
                        
                    </Modal>
                    <Modal id = "bgCP">
                        <SketchPicker onChange = {this.handleColorChange}></SketchPicker>
                        <a style = {modalStyle} name = "bg" onClick = {this.setColor} class="waves-effect waves-light grey btn-small modal-close">apply</a>
                        
                    </Modal>
                    <Modal id = "bcCP">
                        <SketchPicker onChange = {this.handleColorChange}></SketchPicker>
                        <a style = {modalStyle} name = "bc" onClick = {this.setColor} class="waves-effect waves-light grey btn-small modal-close">apply</a>
                        
                    </Modal>
                    <svg className = "modal-trigger" data-target = "bcCP" height = "60" width = "60" style = {bccircle}>
                        <circle cx = "25" cy = "25" r = "25"></circle>
                    </svg>
                    <div class = "input-field" style = {thickInput}>
                        <label>Thickness</label>
                        <input name = "updateThick" className = "active" type= "text" value = {this.state.newBorThick} onChange = {this.handleChange}></input>
                    </div>
                    <div class = "input-field" style = {radInput}>
                        <label>Radius</label>
                        <input name = "updateRad" className = "active" type= "text" value = {this.state.updateBorderRad} onChange = {this.handleChange}></input>
                    </div>
                    <b style = {label5}>Width:</b>
                    <b style = {label6}>Height:</b>
                    <div class = "input-field" style = {WidthInput}>
                        <label>Width</label>
                        <input className = "active" type= "text" name = "tempWidth" onChange = {this.handleChange}></input>
                    </div>
                    <div class = "input-field" style = {HeightInput}>
                        <label>Height</label>
                        <input className = "active" type= "text" name = "tempHeight" onChange = {this.handleChange}></input>
                    </div>
                    <a class= {"waves-effect waves-light grey btn-small " + this.state.dimDis}
                    style = {UpdateBTN} onClick = {this.applyDim}>Update</a>
                    <Rnd default = {{x: -125, y: -110}}>
                    <div className = "container" id = "Wireframe">
                        <svg id = "diagram" width = {this.state.width} height = {this.state.height} 
                            style = {WireframeStyle} onClick = {this.undoControl}>
                            <rect  width = {this.state.width} height = {this.state.height}> 
                            </rect> 
                        </svg>
                    </div>
                    </Rnd>
                    <div id = "wireframe-components">

                    </div>
                    
                </div>
            </div>
        );
    }
}

const SORT_BY_TASK_INCREASING = 'sort_by_task_increasing';
const SORT_BY_TASK_DECREASING = 'sort_by_task_decreasing';
const SORT_BY_DUE_DATE_INCREASING = 'sort_by_due_date_increasing';
const SORT_BY_DUE_DATE_DECREASING = 'sort_by_due_date_decreasing';
const SORT_BY_STATUS_INCREASING = 'sort_by_status_increasing';
const SORT_BY_STATUS_DECREASING = 'sort_by_status_decreasing';

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { Wireframes } = state.firestore.data;
    const Wireframe = Wireframes ? Wireframes[id] : null;
    if (Wireframe)
        Wireframe.id = id;

    return {
        Wireframe,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'Wireframes' },
    ]),
)(ListScreen);