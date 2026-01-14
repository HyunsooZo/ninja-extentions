function typeToKotlin(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'String';
            case 'number': return 'Double';
            case 'boolean': return 'Boolean';
            case 'null': return 'Any?';
            default: return 'Any';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToKotlin(typeInfo.itemType);
        return `List<${itemType}>`;
    }

    if (typeInfo.type === 'object') {
        return 'Any';
    }

    return 'Any';
}

function toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

function generateDataClass(properties, name) {
    let code = `data class ${name}(\n`;

    const entries = Object.entries(properties);

    if (entries.length === 0) {
        code += `)`;
        return code;
    }

    for (let i = 0; i < entries.length; i++) {
        const [key, prop] = entries[i];
        const kotlinType = typeToKotlin(prop.type);
        const fieldName = toCamelCase(key);
        const comma = i < entries.length - 1 ? ',' : '';

        code += `    val ${fieldName}: ${kotlinType}${comma}\n`;
    }

    code += `)`;

    return code;
}

function generate(parsedData, typeName) {
    return generateDataClass(parsedData.properties, typeName);
}

module.exports = { generate };
