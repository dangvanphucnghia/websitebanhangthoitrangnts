package com.shopthoitrangnts.service;

import com.shopthoitrangnts.dto.OrderDetailDTO;
import com.shopthoitrangnts.entity.OrderDetail;
import com.shopthoitrangnts.exception.DataNotFoundException;

import java.util.List;

public interface IOrderDetailService {
    OrderDetail createOrderDetail(OrderDetailDTO orderDetailDTO) throws Exception;

    OrderDetail getOrderDetail(Long id) throws Exception;

    OrderDetail updateOrderDetail(Long id, OrderDetailDTO orderDetailDTO) throws DataNotFoundException;

    void deleteById(Long id);

    List<OrderDetail> findByOrderId(Long orderId);
}
