import { REPLACE, PROPS, TEXT} from './config';

function patch(node, patches) {
    //currIndex记录当前处理的节点
    let walker = {index: 0};
    walk(node, walker, patches);
}

function walk(node, walker, patches) {
    //当前节点的补丁
    let currPatches = patches[walker.index];
    //深度遍历
    (node.childNodes || []).forEach(childNode => {
        walker.index++
        walk(childNode, walker, patches);
    });
    currPatches && applayPatch(node, currPatches);
}

function applayPatch(node, currPatches) {
    currPatches.forEach(patch => {
        switch(patch.type) {
            case REPLACE: {
                //替换情况： 文本节点 or dom节点
                if(patch.node) {
                    let newEle = Object.prototype.toString.call(patch.node) === '[object string]' 
                        ? document.createTextNode(patch.node) 
                        : patch.node.render();
                    node.parentNode.replaceChild(newEle, node);
                }else {
                    node.parentNode.removeChild(node);
                }
                break;
            };
            case PROPS: {
                Object.keys(patch.props).forEach(attrKey => {
                    if(patch.props[attrKey] === undefined) {
                        node.removeAttribute(attrKey);
                    }else {
                        node.setAttribute(attrKey, patch.props[attrKey]);
                    }
                })
                break;
            };
            case TEXT: 
                node.textContent = patch.content;
                break;
        }
    });
}

export default patch;