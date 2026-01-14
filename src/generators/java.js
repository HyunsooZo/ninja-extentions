function typeToJava(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'String';
            case 'number': return 'Double';
            case 'boolean': return 'Boolean';
            case 'null': return 'Object';
            default: return 'Object';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToJava(typeInfo.itemType);
        return `List<${itemType}>`;
    }

    if (typeInfo.type === 'object') {
        return 'Object';
    }

    return 'Object';
}

function toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

function generateClass(properties, name) {
    let code = `import java.util.List;\n\n`;
    code += `public class ${name} {\n`;

    const entries = Object.entries(properties);

    // 멤버 변수
    for (const [key, prop] of entries) {
        const javaType = typeToJava(prop.type);
        const fieldName = toCamelCase(key);
        code += `    private ${javaType} ${fieldName};\n`;
    }

    if (entries.length === 0) {
        code += `    // Empty class\n`;
    }

    code += `\n`;

    // Getter/Setter
    for (const [key, prop] of entries) {
        const javaType = typeToJava(prop.type);
        const fieldName = toCamelCase(key);
        const capitalizedField = key.charAt(0).toUpperCase() + key.slice(1);

        // Getter
        code += `    public ${javaType} get${capitalizedField}() {\n`;
        code += `        return ${fieldName};\n`;
        code += `    }\n\n`;

        // Setter
        code += `    public void set${capitalizedField}(${javaType} ${fieldName}) {\n`;
        code += `        this.${fieldName} = ${fieldName};\n`;
        code += `    }\n\n`;
    }

    code += `}`;

    return code;
}

function generate(parsedData, typeName) {
    return generateClass(parsedData.properties, typeName);
}

module.exports = { generate };
