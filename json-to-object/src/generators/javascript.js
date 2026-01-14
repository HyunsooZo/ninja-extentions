function typeToJSDoc(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'string';
            case 'number': return 'number';
            case 'boolean': return 'boolean';
            case 'null': return 'null';
            default: return '*';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToJSDoc(typeInfo.itemType);
        return `Array<${itemType}>`;
    }

    if (typeInfo.type === 'object') {
        return 'Object';
    }

    return '*';
}

function generateClass(properties, name) {
    let code = `/**\n * @typedef {Object} ${name}\n`;

    for (const [key, prop] of Object.entries(properties)) {
        const jsType = typeToJSDoc(prop.type);
        code += ` * @property {${jsType}} ${key}\n`;
    }

    code += ' */\n\n';
    code += `class ${name} {\n`;
    code += `  constructor(data) {\n`;

    for (const key of Object.keys(properties)) {
        code += `    this.${key} = data.${key};\n`;
    }

    code += `  }\n`;
    code += `}`;

    return code;
}

function generate(parsedData, typeName) {
    let code = generateClass(parsedData.properties, typeName);

    if (parsedData.isArray) {
        code += `\n\n/**\n * @type {Array<${typeName}>}\n */`;
    }

    return code;
}

module.exports = { generate };
