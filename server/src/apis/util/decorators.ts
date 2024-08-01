import "reflect-metadata";


const path = Symbol("path");

function Path(value: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("target="+target);
        console.log("key="+propertyKey);
        descriptor.value = value;
    };
}

export default Path;
