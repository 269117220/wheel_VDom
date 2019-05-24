import { REPLACE, PROPS, TEXT} from './config';

//增、删、改
function diff(oldTree, newTree) {
    let patches = [];
    let index = 0;
    walk(oldTree, newTree, index, patches);
    return patches;
}

function walk(oldTree, newTree, index, patches) {
    let currPatches = [];
    if(checkType(oldTree, newTree, 'String')) {
        //皆为字符串 && 不相同
        if(oldTree !== newTree) {
            currPatches.push({
                type: TEXT,
                content: newTree
            });
        }
    }else if(oldTree && newTree && oldTree.tagName === newTree.tagName && oldTree.key === newTree.key) {
        //两个节点相同的情况下
        let propsPatches = diffProps(oldTree, newTree);
        if(propsPatches) {
            currPatches.push({ type: PROPS, props: propsPatches });
        }
        diffChilds(oldTree.childrens, newTree.childrens, index, patches, currPatches);
    }else {
        //节点不同的情况
        currPatches.push({
            type: REPLACE,
            node: newTree
        });
    }
    currPatches.length && (patches[index] = currPatches);
}

function diffChilds(oldChildrens, newChildrens, index, patches, currPatches) {
    /**
     * currPatches包括子节点的调序，这里不做处理
     */
    let currNodeIndex = index, leftNode = null;
    //深度优先遍历
    oldChildrens.forEach((oldChild, i) => {
        let newChild = newChildrens[i];
        currNodeIndex = currNodeIndex + ((leftNode && (leftNode.child_nums + 1)) || 1);
        walk(oldChild, newChild, currNodeIndex, patches);
        leftNode = oldChild;
    });
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

function checkType(oldItem, newItem, type) {
    let fun = Object.prototype.toString;
    return fun.call(oldItem) === fun.call(newItem) && fun.call(newItem).slice(8, -1) === type;
}

export default diff;