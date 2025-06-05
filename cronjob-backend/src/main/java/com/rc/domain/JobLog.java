package com.rc.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 任务执行日志实体类
 */
@Data
@TableName("job_log")
@EqualsAndHashCode(callSuper = false)
public class JobLog {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 关联任务ID
     */
    @TableField("job_id")
    private Long jobId;
    
    /**
     * 执行ID，用于标识单次执行
     */
    @TableField("execution_id")
    private String executionId;
    
    /**
     * 开始时间
     */
    @TableField("start_time")
    private LocalDateTime startTime;
    
    /**
     * 结束时间
     */
    @TableField("end_time")
    private LocalDateTime endTime;
    
    /**
     * 执行时长（秒）
     */
    @TableField("duration")
    private Integer duration;
    
    /**
     * 执行状态: 0-失败, 1-成功, 2-运行中
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 执行输出
     */
    @TableField("output")
    private String output;
    
    /**
     * 错误信息
     */
    @TableField("error_msg")
    private String errorMsg;
    
    /**
     * 退出码
     */
    @TableField("exit_code")
    private Integer exitCode;
    
    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 执行状态枚举
     */
    public enum Status {
        FAILURE(0, "失败"),
        SUCCESS(1, "成功"),
        RUNNING(2, "运行中");
        
        private final int code;
        private final String description;
        
        Status(int code, String description) {
            this.code = code;
            this.description = description;
        }
        
        public int getCode() {
            return code;
        }
        
        public String getDescription() {
            return description;
        }
        
        public static Status fromCode(int code) {
            for (Status status : values()) {
                if (status.code == code) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Invalid status code: " + code);
        }
    }
}