package com.rc.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 定时任务实体类
 */
@Data
@TableName("job")
@EqualsAndHashCode(callSuper = false)
public class Job {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 任务名称
     */
    @TableField("name")
    private String name;
    
    /**
     * 任务描述
     */
    @TableField("description")
    private String description;
    
    /**
     * Cron表达式
     */
    @TableField("cron_expr")
    private String cronExpr;
    
    /**
     * 关联脚本ID
     */
    @TableField("script_id")
    private Long scriptId;
    
    /**
     * 任务状态: 0-停用, 1-启用, 2-运行中, 3-错误
     */
    @TableField("status")
    private Integer status = 1;
    
    /**
     * 成功执行次数
     */
    @TableField("success_count")
    private Integer successCount = 0;
    
    /**
     * 失败执行次数
     */
    @TableField("failure_count")
    private Integer failureCount = 0;
    
    /**
     * 上次执行时间
     */
    @TableField("last_run_time")
    private LocalDateTime lastRunTime;
    
    /**
     * 下次执行时间
     */
    @TableField("next_run_time")
    private LocalDateTime nextRunTime;
    
    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
}