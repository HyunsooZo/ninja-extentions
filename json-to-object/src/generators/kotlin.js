const { toPascalCase, toCamelCase, collectNestedTypes } = require('../utils');

/**
 * @typedef {Object} KotlinOptions
 * @property {boolean} [useJsonProperty] - @JsonProperty 어노테이션 추가
 * @property {boolean} [multipleFiles] - 여러 파일로 분리
 */

function typeToKotlin(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'String';
            case 'integer': return 'Int';
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

    // Kotlin doesn't have native union types, use Any
    if (typeInfo.type === 'union') {
        return 'Any';
    }

    if (typeInfo.type === 'object') {
        return 'Any';
    }

    switch (typeInfo.type) {
        case 'string': return 'String';
        case 'integer': return 'Int';
        case 'number': return 'Double';
        case 'boolean': return 'Boolean';
        case 'null': return 'Any?';
        default: return 'Any';
    }
}

function getTypeForProperty(key, prop) {
    if (prop.type === 'object' && prop.properties) {
        return toPascalCase(key);
    }
    if (prop.type === 'array' && prop.itemType) {
        if (prop.itemType.type === 'object' && prop.itemType.properties) {
            return `List<${toPascalCase(key)}Item>`;
        }
        const itemType = typeToKotlin(prop.itemType);
        return `List<${itemType}>`;
    }
    return typeToKotlin(prop);
}

function generateDataClass(properties, name, options = {}) {
    const { useJsonProperty } = options;
    let code = `data class ${name}(\n`;

    const entries = Object.entries(properties);

    if (entries.length === 0) {
        code += `)`;
        return code;
    }

    for (let i = 0; i < entries.length; i++) {
        const [key, prop] = entries[i];
        const kotlinType = getTypeForProperty(key, prop);
        const fieldName = toCamelCase(key);
        const comma = i < entries.length - 1 ? ',' : '';

        if (useJsonProperty && key !== fieldName) {
            code += `    @JsonProperty("${key}")\n`;
        }
        code += `    val ${fieldName}: ${kotlinType}${comma}\n`;
    }

    code += `)`;

    return code;
}

function generateNestedDataClasses(properties, options = {}) {
    let nestedCode = '';

    for (const [key, prop] of Object.entries(properties)) {
        if (prop.type === 'object' && prop.properties) {
            const nestedName = toPascalCase(key);
            // Recursively generate nested data classes first
            nestedCode += generateNestedDataClasses(prop.properties, options);
            nestedCode += generateDataClass(prop.properties, nestedName, options);
            nestedCode += '\n\n';
        } else if (prop.type === 'array' && prop.itemType) {
            if (prop.itemType.type === 'object' && prop.itemType.properties) {
                const nestedName = toPascalCase(key) + 'Item';
                nestedCode += generateNestedDataClasses(prop.itemType.properties, options);
                nestedCode += generateDataClass(prop.itemType.properties, nestedName, options);
                nestedCode += '\n\n';
            }
        }
    }

    return nestedCode;
}

function buildImports(options = {}) {
    let imports = '';
    if (options.useJsonProperty) {
        imports += 'import com.fasterxml.jackson.annotation.JsonProperty\n\n';
    }
    return imports;
}

function generateMultipleFiles(parsedData, typeName, options = {}) {
    const className = toPascalCase(typeName);
    const files = [];
    const imports = buildImports(options);

    function collectFiles(properties) {
        for (const [key, prop] of Object.entries(properties)) {
            if (prop.type === 'object' && prop.properties) {
                const nestedName = toPascalCase(key);
                collectFiles(prop.properties);
                files.push({
                    filename: `${nestedName}.kt`,
                    content: imports + generateDataClass(prop.properties, nestedName, options),
                    language: 'kotlin'
                });
            } else if (prop.type === 'array' && prop.itemType) {
                if (prop.itemType.type === 'object' && prop.itemType.properties) {
                    const nestedName = toPascalCase(key) + 'Item';
                    collectFiles(prop.itemType.properties);
                    files.push({
                        filename: `${nestedName}.kt`,
                        content: imports + generateDataClass(prop.itemType.properties, nestedName, options),
                        language: 'kotlin'
                    });
                }
            }
        }
    }

    collectFiles(parsedData.properties);

    files.push({
        filename: `${className}.kt`,
        content: imports + generateDataClass(parsedData.properties, className, options),
        language: 'kotlin'
    });

    return files;
}

function generate(parsedData, typeName, options = {}) {
    if (options.multipleFiles) {
        return generateMultipleFiles(parsedData, typeName, options);
    }

    const className = toPascalCase(typeName);

    let code = buildImports(options);

    // Generate nested data classes first
    const nestedClasses = generateNestedDataClasses(parsedData.properties, options);
    if (nestedClasses) {
        code += nestedClasses;
    }

    // Generate main data class
    code += generateDataClass(parsedData.properties, className, options);

    return code;
}

module.exports = { generate };
