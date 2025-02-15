package com.shopthoitrangnts.service;

import com.shopthoitrangnts.dto.OrderDTO;
import com.shopthoitrangnts.entity.Order;
import com.shopthoitrangnts.exception.DataNotFoundException;

import java.util.List;

public interface IOrderService {
    Order createOrder(OrderDTO orderDTO) throws Exception;

    Order getOrder(Long id);

    Order updateOrder(Long id, OrderDTO orderDTO) throws DataNotFoundException;

    void deleteOrder(Long id);

    List<Order> findByUserId(Long userId);
}
