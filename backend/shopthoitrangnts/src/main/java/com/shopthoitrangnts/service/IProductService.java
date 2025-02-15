package com.shopthoitrangnts.service;

import com.shopthoitrangnts.dto.ProductDTO;
import com.shopthoitrangnts.dto.ProductImageDTO;
import com.shopthoitrangnts.entity.Product;
import com.shopthoitrangnts.entity.ProductImage;
import com.shopthoitrangnts.exception.DataNotFoundException;
import com.shopthoitrangnts.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

public interface IProductService {
    Product createProduct(ProductDTO productDTO) throws Exception;

    Product getProductById(long id) throws Exception;

    Page<ProductResponse> getAllProducts(String keyword, Long categoryId,PageRequest pageRequest);

    Product updateProduct(long id, ProductDTO productDTO) throws Exception;

    void deleteProduct(long id);

    boolean existsByName(String name);

    ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO)
            throws Exception;
}
