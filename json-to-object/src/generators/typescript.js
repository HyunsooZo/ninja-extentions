function typeToTypeScript(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'string';
            case 'number': return 'number';
            case 'boolean': return 'boolean';
            case 'null': return 'null';
            default: return 'any';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToTypeScript(typeInfo.itemType);
        return `${itemType}[]`;
    }

    if (typeInfo.type === 'object') {
        // 중첩된 객체는 별도 인터페이스로
        return 'object';
    }

    return 'any';
}

function generateInterface(properties, name, indent = '') {
    let code = `${indent}interface ${name} {\n`;

    for (const [key, prop] of Object.entries(properties)) {
        const optional = prop.optional ? '?' : '';

        if (typeof prop.type === 'object' && prop.type.type === 'object') {
            // 중첩된 객체
            const nestedName = capitalize(key);
            code += `${indent}  ${key}${optional}: ${nestedName};\n`;
        } else {
            const tsType = typeToTypeScript(prop.type);
            code += `${indent}  ${key}${optional}: ${tsType};\n`;
        }
    }

    code += `${indent}}`;
    return code;
}

function generateNestedInterfaces(properties, baseName) {
    let interfaces = [];

    for (const [key, prop] of Object.entries(properties)) {
        if (typeof prop.type === 'object' && prop.type.type === 'object') {
            const nestedName = capitalize(key);
            interfaces.push(generateInterface(prop.type.properties, nestedName));
            // 재귀적으로 중첩된 인터페이스 생성
            interfaces.push(...generateNestedInterfaces(prop.type.properties, nestedName));
        }
    }

    return interfaces;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generate(parsedData, typeName) {
    let code = '';

    // 중첩된 인터페이스들 먼저 생성
    const nestedInterfaces = generateNestedInterfaces(parsedData.properties, typeName);
    if (nestedInterfaces.length > 0) {
        code += nestedInterfaces.join('\n\n') + '\n\n';
    }

    // 메인 인터페이스 생성
    code += generateInterface(parsedData.properties, typeName);

    if (parsedData.isArray) {
        code += `\n\ntype ${typeName}Array = ${typeName}[];`;
    }

    return code;
}

module.exports = { generate };
