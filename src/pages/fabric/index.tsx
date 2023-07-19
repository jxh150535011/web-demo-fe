import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import styles from './index.less';


const drawGrid = (canvas: fabric.Canvas) => {
    const width = canvas.width || 0;
    const height = canvas.height || 0;
    // @ts-ignore
    const context = canvas.getContext('2d'); 
    var gridSize = 50;
    for(let x = 0; x <= width; x += gridSize) {
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, height);
    }
    for(let y = 0; y <= height; y += gridSize) {
        context.moveTo(0, y + 0.5);
        context.lineTo(width, y + 0.5);
    }
    context.strokeStyle = 'black';
    context.stroke();
}



    

const createFabric = ($canvas: HTMLCanvasElement) => {
    
    fabric.Object.prototype.transparentCorners = false;
    const canvas = new fabric.Canvas($canvas, {
        allowTouchScrolling: true,
        selection: false,
    });
    const red = new fabric.Rect({
        top: 100, left: 0, width: 80, height: 50, fill: 'red', selectable: false });
    const blue = new fabric.Rect({
        top: 0, left: 100, width: 50, height: 70, fill: 'blue', selectable: false });
    const green = new fabric.Rect({
        top: 100, left: 100, width: 60, height: 60, fill: 'green', selectable: false });
    canvas.add(red, blue, green);


    const getPos = (event: any) => {
        const touchEvent = event.e;
        if (!touchEvent) return null;
        const touche = touchEvent.touches ? touchEvent.touches[0] : touchEvent;
        if (!touche) return null;
        return [touche.clientX, touche.clientY];
    }
    

    const activeObj: any = {
        /** 选中元素 */
        target: null,
        /** 鼠标操作便宜量 */
        mousePos: null,
        /** 视图相对偏移量 */
        viewPos: null,
        isDraging: false,
    };
    // 是否拖拽
    const checkDraging = (pos: any) => {
        if (activeObj.isDraging) return activeObj.isDraging;
        if (!activeObj.mousePos) return false;
        const mousePos = activeObj.mousePos;
        // 判定为click
        if (Math.abs(pos[0] - mousePos[0]) < 1 && Math.abs(pos[1] - mousePos[1]) < 1) {
            return false;
        }
        activeObj.isDraging = true;
        return true;
    }

    canvas.on('mouse:down', function(event) {
        const viewportTransform = canvas.viewportTransform;
        if (activeObj.target) {
            // @ts-ignore
            activeObj.viewPos = [activeObj.target.left, activeObj.target.top]
        } else {
            activeObj.viewPos = [
                // @ts-ignore
                viewportTransform[4],
                // @ts-ignore
                viewportTransform[5],
            ]
        };
        activeObj.mousePos = getPos(event);
    })

    

    const handleMoveUpdate = (target: any, pos: any) => {
        if (activeObj.target) {
            canvas.setActiveObject(activeObj.target);
        }
        if (!activeObj.mousePos || !pos) return;
        const mousePos =activeObj.mousePos;
        checkDraging(pos);
        const deltaX = pos[0] - mousePos[0];
        const deltaY = pos[1] - mousePos[1];

        const viewPos = activeObj.viewPos;
        

        if (activeObj.target) {
            // 选中元素操作 则忽略
            if (target) return;
            activeObj.target.left = deltaX + viewPos[0];
            activeObj.target.top = deltaY + viewPos[1];
            return;
        }
        const viewportTransform = canvas.viewportTransform;
        
        // @ts-ignore
        viewportTransform[4] = deltaX + viewPos[0];
        // @ts-ignore
        viewportTransform[5] = deltaY + viewPos[1];
        // @ts-ignore
        canvas.setViewportTransform(viewportTransform);
        
    }

    canvas.on('mouse:move', function (event) {
        const pos = getPos(event);
        handleMoveUpdate(event.target, pos);
        canvas.requestRenderAll();
    })

    canvas.on('mouse:up', function (event) {
        const pos = getPos(event);
        handleMoveUpdate(event.target, pos);
        
        if (!activeObj.isDraging) {
            activeObj.target = event.target;
        }
        if (activeObj.target) {
            canvas.setActiveObject(activeObj.target);
        } else {
            // @ts-ignore
            canvas._activeObject = null;
        }
        
        activeObj.isDraging = false;
        activeObj.mousePos = null;
        canvas.requestRenderAll();
    })

    // drawGrid(canvas);
}


export default function FabricPage() {
    const ref = useRef<any>();

    useEffect(() => {
        if (!ref.current) return;
        return createFabric(ref.current);
    }, [ref.current]);

    return (
    <div className={styles.page}>
        <canvas ref={ref} width="600" height="600"></canvas>
    </div>
    );
}
