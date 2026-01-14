function typeToGo(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'string';
            case 'number': return 'float64';
            case 'boolean': return 'bool';
            case 'null': return 'interface{}';
            default: return 'interface{}';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToGo(typeInfo.itemType);
        return `[]${itemType}`;
    }

    if (typeInfo.type === 'object') {
        return 'interface{}';
    }

    return 'interface{}';
}

function toPascalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function generateStruct(properties, name) {
    let code = `type ${name} struct {\n`;

    const entries = Object.entries(properties);

    if (entries.length === 0) {
        code += `}\n`;
        return code;
    }

    for (const [key, prop] of entries) {
        const goType = typeToGo(prop.type);
        const fieldName = toPascalCase(key);

        code += `\t${fieldName} ${goType} \`json:"${key}"\`\n`;
    }

    code += `}`;

    return code;
}

function generate(parsedData, typeName) {
    return generateStruct(parsedData.properties, typeName);
}

module.exports = { generate };
