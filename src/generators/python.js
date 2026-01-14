function typeToPython(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'str';
            case 'number': return 'float';
            case 'boolean': return 'bool';
            case 'null': return 'None';
            default: return 'Any';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToPython(typeInfo.itemType);
        return `list[${itemType}]`;
    }

    if (typeInfo.type === 'object') {
        return 'dict';
    }

    return 'Any';
}

function toSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function generateDataclass(properties, name) {
    let code = 'from dataclasses import dataclass\nfrom typing import Any\n\n';
    code += `@dataclass\n`;
    code += `class ${name}:\n`;

    const entries = Object.entries(properties);
    if (entries.length === 0) {
        code += `    pass\n`;
        return code;
    }

    for (const [key, prop] of entries) {
        const pyType = typeToPython(prop.type);
        const fieldName = toSnakeCase(key);
        code += `    ${fieldName}: ${pyType}\n`;
    }

    return code;
}

function generate(parsedData, typeName) {
    return generateDataclass(parsedData.properties, typeName);
}

module.exports = { generate };
