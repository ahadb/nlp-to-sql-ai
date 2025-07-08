import os

def print_tree(dir_path, prefix="", depth=3):
    if depth == 0:
        return
    try:
        items = sorted(os.listdir(dir_path))
    except PermissionError:
        return
    for index, item in enumerate(items):
        path = os.path.join(dir_path, item)
        connector = "└── " if index == len(items) - 1 else "├── "
        print(f"{prefix}{connector}{item}")
        if os.path.isdir(path):
            new_prefix = prefix + ("    " if index == len(items) - 1 else "│   ")
            print_tree(path, new_prefix, depth - 1)

def validate_sql_safety(sql: str, include_select: bool = False) -> dict:
        """
        Validate SQL query for forbidden/unsafe commands
        
        Args:
            sql: SQL query string to validate
            include_select: Whether to include SELECT in forbidden words
            
        Returns:
            dict containing:
                is_safe (bool): Whether SQL is safe
                message (str): Error message if unsafe
        """
        sql = sql.strip().lower()
        
        # Define forbidden words
        forbidden = ["drop", "delete", "alter", "truncate", "rename", 
                    "create", "insert", "update", "delete"]
        
        # Optionally include SELECT in forbidden words
        if include_select:
            forbidden.append("select")
            
        # Check for forbidden words
        for word in forbidden:
            if word in sql:
                return {
                    "is_safe": False,
                    "message": f"Forbidden word '{word}' detected in query"
                }
                
        return {
            "is_safe": True,
            "message": "SQL query is safe"
        }
