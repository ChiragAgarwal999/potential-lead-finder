def enqueue_manual_task(task_name:str, payload:dict)->dict:
    return {"task":task_name,"queued":True,"payload":payload}
