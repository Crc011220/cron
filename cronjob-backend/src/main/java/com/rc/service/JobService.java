package com.rc.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rc.domain.Job;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author chenruochen
* @description 针对表【job】的数据库操作Service
* @createDate 2025-05-30 15:26:37
*/
public interface JobService extends IService<Job> {

    Page<Job> findByPage(Page<Job> page, Integer status, String keyword);
}
