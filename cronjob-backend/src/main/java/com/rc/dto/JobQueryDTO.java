package com.rc.dto;

import lombok.Data;

/**
 * 任务查询条件DTO
 */
@Data
public class JobQueryDTO {
    
    /**
     * 页码，从1开始
     */
    private Integer page = 1;
    
    /**
     * 每页数量
     */
    private Integer size = 10;
    
    /**
     * 状态筛选
     */
    private Integer status;
    
    /**
     * 搜索关键字
     */
    private String keyword;
    
    /**
     * 排序字段
     */
    private String sortBy = "createdAt";
    
    /**
     * 排序方向：asc/desc
     */
    private String sortDirection = "desc";
}