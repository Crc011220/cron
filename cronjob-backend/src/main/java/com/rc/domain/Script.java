package com.rc.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 脚本实体类
 */
@Data
@TableName("script")
@EqualsAndHashCode(callSuper = false)
public class Script {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 脚本名称
     */
    @TableField("name")
    private String name;
    
    /**
     * 脚本描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 原始文件名
     */
    @TableField("file_name")
    private String fileName;
    
    /**
     * 文件存储路径
     */
    @TableField("file_path")
    private String filePath;
    
    /**
     * 文件大小（字节）
     */
    @TableField("file_size")
    private Long fileSize;
    
    /**
     * 运行环境
     */
    @TableField("environment")
    private String environment;
    
    /**
     * 文件类型
     */
    @TableField("file_type")
    private String fileType;
    
    /**
     * 文件MD5值，用于去重
     */
    @TableField("file_md5")
    private String fileMd5;
    
    /**
     * 是否被使用
     */
    @TableField("is_used")
    private Boolean isUsed = false;
    
    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}