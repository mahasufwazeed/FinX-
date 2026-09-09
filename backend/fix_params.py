import os
import re

path = "C:/Users/moham/Downloads/FinX-/backend/src/controllers/"

for filename in os.listdir(path):
    if not filename.endswith(".ts"): continue
    
    with open(path+filename, "r") as f:
        content = f.read()
    
    # replace { id } = req.params -> const id = String(req.params.id);
    content = re.sub(r'const\s*{\s*id\s*}\s*=\s*req\.params\s*;', r'const id = String(req.params.id);', content)
    
    # replace { milestoneId } = req.params -> const milestoneId = String(req.params.milestoneId);
    content = re.sub(r'const\s*{\s*milestoneId\s*}\s*=\s*req\.params\s*;', r'const milestoneId = String(req.params.milestoneId);', content)
    
    # replace { projectId } = req.params -> const projectId = String(req.params.projectId);
    content = re.sub(r'const\s*{\s*projectId\s*}\s*=\s*req\.params\s*;', r'const projectId = String(req.params.projectId);', content)
    
    # replace req.params.paymentId -> String(req.params.paymentId)
    content = content.replace("req.params.paymentId", "String(req.params.paymentId)")
    content = content.replace("String(String(req.params.paymentId))", "String(req.params.paymentId)") # dedup
    content = content.replace("req.params.id", "String(req.params.id)")
    content = content.replace("String(String(req.params.id))", "String(req.params.id)") # dedup
    
    with open(path+filename, "w") as f:
        f.write(content)
