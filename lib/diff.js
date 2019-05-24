//增、删、改
function diff(oldTree, newTree) {
    let patches = [];
    let index = 0;
    walk(oldTree, newTree, index, patches);
    return patches;
}

var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

function walk(oldTree, newTree, index, patches) {
    let currPatches = [];
    if(isStr(oldTree) && isStr(newTree)) {
        //皆为字符串 && 不相同
        if(oldTree !== newTree) {
            patches.push({
                type: TEXT,
                content: newTree
            });
        }
    }else if(oldTree.tagName == newTree.tagName && oldTree.key === newTree.key) {
        //两个节点相同的情况下
        let propsPatches = diffProps(oldTree, newTree);
        if(propsPatches) {
            currPatches.push(propsPatches);
        }
        diffChilds(oldTree, newTree, index, patches);
    }else {
        //节点不同的情况
        currPatches.push({
            type: REPLACE,
            node: newTree
        });
    }
    currPatches.length && (patches[index] = currPatches);
}

function diffChilds() {
    
}

function diffProps({ props: oldProps }, { props: newProps }) {
    let propsPatches = {};
    Object.keys(oldProps).forEach(key => {
        if(newProps[key] !== oldProps[key]) {
            propsPatches[key] = newProps[key] || '';
        }
    });

    Object.keys(newProps).forEach(key => {
        if(!oldProps[key]) {
            propsPatches[key] = newProps[key];
        }
    });

    return Object.keys(propsPatches).length && propsPatches || null;
}

function isStr(item) {
    return Object.prototype.toString.call(item) === '[object String]';
}