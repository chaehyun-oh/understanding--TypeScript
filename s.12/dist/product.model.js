"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(t, p) {
        this.title = t;
        this.price = p;
    }
    getInfo() {
        return [this.title, `$${this.price}`];
    }
}
exports.Product = Product;
//# sourceMappingURL=product.model.js.map