package com.rc.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rc.domain.JobLog;
import com.rc.service.JobLogService;
import com.rc.mapper.JobLogMapper;
import org.springframework.stereotype.Service;

/**
* @author chenruochen
* @description 针对表【job_log】的数据库操作Service实现
* @createDate 2025-05-30 15:27:18
*/
@Service
public class JobLogServiceImpl extends ServiceImpl<JobLogMapper, JobLog>
    implements JobLogService{

}




