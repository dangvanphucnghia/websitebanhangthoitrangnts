package com.shopthoitrangnts.service;

import com.shopthoitrangnts.dto.CategoryDTO;
import com.shopthoitrangnts.entity.Category;

import java.util.List;

public interface ICategoryService {
    Category createCategory(CategoryDTO categoryDTO);
    Category getCategoryById(long id);
    List<Category> getAllCategories();
    Category updateCategory(long categoryId, CategoryDTO categoryDTO);
    void deleteCategory(long id);
}
