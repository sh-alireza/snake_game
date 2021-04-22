import React from "react";
import "./App.css";
import items from "./components/items";

class App extends React.Component{
    constructor(props) {
        super(props);

        this.state={
            food : this.randomPosition(),
            snake : [this.randomPosition()],
            speed : {
                x : 1,
                y : 0
            },
            direction : "right",
            forbidden_direction : "left",
        }
        //this.handler = setInterval(this.update,300);
    }
    handleKeyPress = (event) => {
        let direction = this.state.direction;
        let forbidden_direction = this.state.forbidden_direction;
        switch (event.keyCode){
            case 37 :
                direction = "left";
                forbidden_direction = "right"
                break;
            case 38 :
                direction = "up";
                forbidden_direction = "down";
                break;
            case 39 :
                direction = "right";
                forbidden_direction = "left";
                break;
            case 40 :
                direction = "down";
                forbidden_direction = "up";
                break;
            default:
        }
        if (direction !== this.state.direction && direction !== this.state.forbidden_direction){
            this.setState({
                direction: direction,
                forbidden_direction: forbidden_direction,
                speed : {
                    x : direction === "right" ? 1 : direction === "left" ? -1 : 0,
                    y : direction === "up" ? -1 : direction === "down" ? 1 : 0,
                }
            })
        }
    }

    componentDidMount() {
        setInterval(() => {this.update()},100)
        document.addEventListener("keydown",this.handleKeyPress)
    }

    randomPosition = () => {
        return {
            column: Math.floor(Math.random() * 20),
            row: Math.floor(Math.random() * 20)
        }
    }

    eat = () => {
        let head = this.state.snake[this.state.snake.length - 1];
        let food = this.state.food;
        return head.column === food.column && head.row === food.row;
    }

    gameOver = () =>{
        let snake = this.state.snake;
        let head = snake[snake.length - 1];
        for ( let i = 0 ; i < snake.length - 1 ; i++){
            if ( head.column === snake[i].column && head.row === snake[i].row){
                return true
            }
        }
        return false;
    }

    update = () => {
        let snake = this.state.snake;
        let head = snake[snake.length - 1];
        let food = this.state.food;
        if (this.eat()){
            food = this.randomPosition()
        }else{
            snake.shift();
        }
        snake.push(this.check({
            column : head.column + this.state.speed.x,
            row : head.row + this.state.speed.y
        }))
        if (this.gameOver()){
            snake = [this.randomPosition()];
            food = this.randomPosition();
        }
        this.setState({
            snake : snake,
            food : food,
        })
    }

    check (segment) {
        if (segment.column > 19){
            segment.column = 0;
        }
        if (segment.column < 0){
            segment.column = 19
        }
        if ( segment.row > 19){
            segment.row = 0;
        }
        if (segment.row < 0){
            segment.row = 19
        }
        return segment;
    }

    draw(){
        let items = [];
        for ( let i = 0 ; i < 20 ; i++){
            for (let j = 0 ; j < 20 ; j++){
                if ( j === this.state.food.column && i === this.state.food.row){
                    items.push(<items className={"items food"}/>)
                }
                else{
                    items.push(<items className={"items"}/>)
                }
            }
        }
        for (let i = 0 ; i < this.state.snake.length ; i++){
            let segment = this.state.snake[i];
            items[segment.row * 20 + segment.column] = <items className={"items snake"}/>
        }
        return items;
    }

    render(){
        return(
            <div className={"App"} onKeyUp={this.move}>
                {this.draw()}
            </div>
        );
    }
}
export default App;