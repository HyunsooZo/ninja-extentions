function typeToRust(typeInfo) {
    if (typeof typeInfo === 'string') {
        switch (typeInfo) {
            case 'string': return 'String';
            case 'number': return 'f64';
            case 'boolean': return 'bool';
            case 'null': return 'Option<()>';
            default: return 'serde_json::Value';
        }
    }

    if (typeInfo.type === 'array') {
        const itemType = typeToRust(typeInfo.itemType);
        return `Vec<${itemType}>`;
    }

    if (typeInfo.type === 'object') {
        return 'serde_json::Value';
    }

    return 'serde_json::Value';
}

function toSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function generateStruct(properties, name) {
    let code = 'use serde::{Deserialize, Serialize};\n\n';
    code += `#[derive(Debug, Serialize, Deserialize)]\n`;
    code += `pub struct ${name} {\n`;

    const entries = Object.entries(properties);
    if (entries.length === 0) {
        code += `}\n`;
        return code;
    }

    for (const [key, prop] of entries) {
        const rustType = typeToRust(prop.type);
        const fieldName = toSnakeCase(key);

        if (fieldName !== key) {
            code += `    #[serde(rename = "${key}")]\n`;
        }
        code += `    pub ${fieldName}: ${rustType},\n`;
    }

    code += `}`;

    return code;
}

function generate(parsedData, typeName) {
    return generateStruct(parsedData.properties, typeName);
}

module.exports = { generate };
