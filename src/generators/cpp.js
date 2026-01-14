function typeToCpp(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'std::string';
            case 'number': return 'double';
            case 'boolean': return 'bool';
            case 'null': return 'std::nullptr_t';
            default: return 'std::any';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToCpp(typeInfo.itemType);
        return `std::vector<${itemType}>`;
    }

    if (typeInfo.type === 'object') {
        return 'std::any';
    }

    return 'std::any';
}

function toSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function generateClass(properties, name) {
    let code = `#include <string>\n#include <vector>\n#include <any>\n\n`;
    code += `class ${name} {\n`;
    code += `public:\n`;

    const entries = Object.entries(properties);

    // 멤버 변수
    for (const [key, prop] of entries) {
        const cppType = typeToCpp(prop.type);
        const fieldName = toSnakeCase(key);
        code += `    ${cppType} ${fieldName};\n`;
    }

    if (entries.length === 0) {
        code += `    // Empty class\n`;
    }

    // 생성자
    code += `\n    ${name}() = default;\n`;

    code += `};`;

    return code;
}

function generate(parsedData, typeName) {
    return generateClass(parsedData.properties, typeName);
}

module.exports = { generate };
