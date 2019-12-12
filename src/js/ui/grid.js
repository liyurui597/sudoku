const Toolkit = require("../core/toolkit");
// const Generator = require("../core/generator");
const Sudoku = require("../core/sudoku");
const Checker = require("../core/checker");
// const matrix = toolkit.makeMatrix();
// console.log(matrix);

// const a=Array.from({length:9},(v,i) => i);
// console.log(a);
// console.log(toolkit.shuffle(a));
//九宫格生成在container中
//生成九宫格
class Grid{
    constructor(container){
        this._$container = container;
    }
    build(){
        const sudoku = new Sudoku();
        sudoku.make();
        //测试使用
        // const matrix = sudoku.solutionMatrix;
        const matrix = sudoku.puzzleMatrix;
        //生成一个Generator对象
        // const generator = new Generator();
        // generator.generate();
        // //生成数组
        // const matrix = generator.matrix;
        // const matrix = Toolkit.matrix.makeMatrix();
        //为宫定义class行与列
        const rowGroupClasses = ["row_g_top","row_g_middle","row_g_bottom"];
        const colGroupClasses = ["col_g_left","col_g_center","col_g_right"];
        //每一行创建一个div将每一行的值new成一个span
        const $cells = matrix.map(rowValues => rowValues
            .map((cellValue,colIndex)=> {
                return $("<span>")
                .addClass(colGroupClasses[colIndex % 3])
                .addClass(cellValue ? "fixed" :"empty")
                .text(cellValue);
            }));
        //从cells中得到div数组
        const $divArray = $cells.map(($spanArray,rowIndex) => {
            return $("<div>")
            .addClass("row")
            .addClass(rowGroupClasses[rowIndex % 3])
            .append($spanArray);
        });
        //添加到container中
        this._$container.append($divArray);
    }
    layout(){
        const width = $("span:first",this._$container).width();
        $("span",this._$container)
            .height(width)
            .css({
                "line-height":`${width}px`,
                "font-size":width<32 ? `${width / 2 }`:""
            });
    }

    //检查用户解谜结果，成功进行提示，失败显示错误标记
    check(){
        //TODO 从界面获取需要检查的数据
        const data = this._$container.children()
            .map((rowIndex,div)=>{
                return $(div).children()
                    .map((colIndex,span) => parseInt($(span).text()) || 0 );
                })
                .toArray()
                .map($data => $data.toArray());
                console.log(data);
                const checker = new Checker(data);
                    if(checker.check()){
                        return true;
                    }
                    //检查不成功，标记
                    const marks = checker.matrixMarks;
                    this._$container.children()
                        .each((rowIndex,div) =>{
                            $(div).children().each((colIndex,span) =>{
                                const $span = $(span);
                                if($span.is(".fixed") || marks[rowIndex][colIndex]){
                                    $span.removeClass("error");
                                }else{
                                    $span.addClass("error");
                                }
                            });
                        });
            }

    //重置当前棋盘至初始状态
    reset(){
        this._$container.find("span:not(.fixed)")
            .removeClass("error mark1 mark2")
            .addClass("empty")
            .text(0);
    }

    //清理错误标记
    clear(){
        this._$container.find("span.error")
            .removeClass("error");
    }

    //重建新的谜盘，开始新的一局
    rebuild(){
        this._$container.empty();
        this.build();
        this.layout();
    }

    bindPopup(popupNumbers){
        this._$container.on("click","span",e => {
            const $cell = $(e.target);
            if($cell.is(".fixed")){
                return;
            }
            popupNumbers.popup($cell);
        });
    }
}

module.exports = Grid;