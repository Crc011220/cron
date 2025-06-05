package com.rc.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 任务数据传输对象
 */
@Data
public class JobDTO {
    
    /**
     * 任务名称
     */
    @NotBlank(message = "任务名称不能为空")
    @Size(max = 128, message = "任务名称长度不能超过128个字符")
    private String name;
    
    /**
     * 任务描述
     */
    @NotBlank(message = "任务描述不能为空")
    private String description;
    
    /**
     * Cron表达式
     */
    @NotBlank(message = "Cron表达式不能为空")
    @Size(max = 64, message = "Cron表达式长度不能超过64个字符")
    private String cronExpr;
    
    /**
     * 关联脚本ID
     */
    @NotNull(message = "脚本ID不能为空")
    private Long scriptId;
    
    /**
     * 运行环境
     */
    @Size(max = 64, message = "运行环境长度不能超过64个字符")
    private String environment;
    
    /**
     * 运行参数
     */
    private String parameters;
    
    /**
     * 任务状态
     */
    private Integer status = 1; // 默认启用
}