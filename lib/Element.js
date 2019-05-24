/**
 * 节点类型
 *  - Element节点
 *  - textNode节点：字符串
 * @param {标签名称} tagName 
 * @param {属性集} props 
 * @param {子节点} childrens 
 */
function Element(tagName, props = {}, childrens = []) {
    console.log('======', tagName);
    //使用时直接Element(),而无需new
    if(!(this instanceof Element)) {
        return new Element(tagName, props, childrens);
    }

    //统计每个Element对象的子节点数目
    let child_nums = 0;
    childrens.forEach(child => {
        if(child instanceof Element) {
            child_nums += child.child_nums;
        }
        child_nums++;
    });

    //Element对象的属性挂载
    Object.assign(this, {
        tagName,
        props,
        childrens,
        child_nums
    });

    //Element对象的渲染
    this.render = () => {
        let node = this;
        //创建Dom节点
        let domNode = document.createElement(node.tagName);
        //创建节点属性
        Object.keys(node.props).forEach(key => {
           domNode.setAttribute(key, node.props[key]);
        });
        node.childrens.forEach(child => {
            let eleChild = (child instanceof Element) ? child.render() : document.createTextNode(child);
            domNode.appendChild(eleChild);
        }); 
        return domNode;
    }

};

// export default Element;

let domStr = Element('ul', {class: 'm-table'}, [
    Element('li', {}, [Element('a', {style: 'color:red'}, ['测试'])]),
    Element('li', {}, ['2']),
    Element('li', {}, ['3'])
]).render();

document.getElementById('root').append(domStr);
