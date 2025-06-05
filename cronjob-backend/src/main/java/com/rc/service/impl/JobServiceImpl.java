package com.rc.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rc.domain.Job;
import com.rc.service.JobService;
import com.rc.mapper.JobMapper;
import org.springframework.stereotype.Service;

@Service
public class JobServiceImpl extends ServiceImpl<JobMapper, Job>
    implements JobService{

    @Override
    public Page<Job> findByPage(Page<Job> page, Integer status, String keyword) {
        return page(page, new LambdaQueryWrapper<Job>()
                .eq(status != null, Job::getStatus, status)
                .like(StringUtils.isNotEmpty(keyword), Job::getName, keyword)
        );
    }
}




