function typeToC(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'char*';
            case 'number': return 'double';
            case 'boolean': return 'int';
            case 'null': return 'void*';
            default: return 'void*';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToC(typeInfo.itemType);
        return `${itemType}*`;
    }

    if (typeInfo.type === 'object') {
        return 'void*';
    }

    return 'void*';
}

function toSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function generateStruct(properties, name) {
    const structName = toSnakeCase(name);
    let code = `#include <stddef.h>\n\n`;
    code += `typedef struct {\n`;

    const entries = Object.entries(properties);
    if (entries.length === 0) {
        code += `    int dummy; // Empty struct placeholder\n`;
    } else {
        for (const [key, prop] of entries) {
            const cType = typeToC(prop.type);
            const fieldName = toSnakeCase(key);
            code += `    ${cType} ${fieldName};\n`;
        }
    }

    code += `} ${structName}_t;`;

    return code;
}

function generate(parsedData, typeName) {
    return generateStruct(parsedData.properties, typeName);
}

module.exports = { generate };
