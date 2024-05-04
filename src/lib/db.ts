import {PrismaClient} from "@prisma/client";

const prisma = require('@prisma/client');
prisma.Decimal.prototype.toJSON = function() {
    return this.toNumber();
}
Date.prototype.toJSON = function () {
    return this.toLocaleDateString();
}

declare global{
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;