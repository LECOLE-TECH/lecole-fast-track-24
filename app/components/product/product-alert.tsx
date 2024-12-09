import { memo } from "react";
import { Alert } from "~/components/common/alert";
import type { ActionType } from "./product-action";
import type { Product } from "~/lib/model";
import { UpdateProduct, DeleteProduct, CreateProduct } from "./product-action";

export const ProductAlert = memo(
  ({
    actionType,
    selectedProduct,
    closeAlert,
  }: {
    actionType: ActionType;
    selectedProduct: Product;
    closeAlert: () => void;
  }) => {
    if (actionType === "create") {
      return (
        <Alert
          title="Create Product"
          description="Create a new product."
          open={true}
          onOpenChange={closeAlert}
        >
          <CreateProduct closeAlert={closeAlert} />
        </Alert>
      );
    }

    if (actionType === "edit") {
      return (
        <Alert
          title="Edit Product"
          description={`Edit the details of ${selectedProduct?.name}.`}
          open={true}
          onOpenChange={closeAlert}
        >
          <UpdateProduct product={selectedProduct} closeAlert={closeAlert} />
        </Alert>
      );
    }

    if (actionType === "delete") {
      return (
        <Alert
          title="Delete Product"
          description={`Are you sure you want to delete ${selectedProduct?.name}?`}
          open={true}
          onOpenChange={closeAlert}
        >
          <DeleteProduct
            id={selectedProduct.id.toString()}
            closeAlert={closeAlert}
          />
        </Alert>
      );
    }
  }
);
