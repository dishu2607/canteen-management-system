function validateRole(role) {
    const validRoles = ["admin", "staff", "manager"];

    if (!role || typeof role !== "string") return false;

    return validRoles.includes(role.toLowerCase());
}

module.exports = validateRole;
