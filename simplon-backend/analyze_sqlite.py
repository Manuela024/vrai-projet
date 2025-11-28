import os
import django
import sqlite3
from django.db import connections

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

def analyze_sqlite_structure():
    print("=== ANALYSE COMPLÈTE SQLite ===")
    
    # Chemin vers votre SQLite
    db_path = 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Liste de toutes les tables
    print("\n📊 1. TABLES DISPONIBLES:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    for table in tables:
        print(f"   📋 {table[0]}")
    
    # 2. Structure de chaque table
    print("\n🏗️  2. STRUCTURE DES TABLES:")
    for table in tables:
        table_name = table[0]
        print(f"\n   📐 Table: {table_name}")
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        for col in columns:
            col_id, col_name, col_type, not_null, default_val, pk = col
            print(f"      └─ {col_name} ({col_type}) {'PRIMARY KEY' if pk else ''} {'NOT NULL' if not_null else ''}")
    
    # 3. Clés étrangères
    print("\n🔗 3. CLÉS ÉTRANGÈRES:")
    for table in tables:
        table_name = table[0]
        cursor.execute(f"PRAGMA foreign_key_list({table_name});")
        foreign_keys = cursor.fetchall()
        if foreign_keys:
            print(f"\n   🔗 Table: {table_name}")
            for fk in foreign_keys:
                id, seq, fk_table, from_col, to_col, on_update, on_delete, match = fk
                print(f"      └─ {from_col} → {fk_table}.{to_col}")
    
    # 4. Indexes
    print("\n📈 4. INDEXES:")
    for table in tables:
        table_name = table[0]
        cursor.execute(f"PRAGMA index_list({table_name});")
        indexes = cursor.fetchall()
        if indexes:
            print(f"\n   📈 Table: {table_name}")
            for idx in indexes:
                seq, index_name, unique = idx
                cursor.execute(f"PRAGMA index_info({index_name});")
                index_cols = cursor.fetchall()
                col_names = [col[2] for col in index_cols]
                print(f"      └─ {index_name} ({', '.join(col_names)}) {'UNIQUE' if unique else ''}")
    
    # 5. Données d'exemple
    print("\n📝 5. DONNÉES D'EXEMPLE:")
    important_tables = ['projects_project', 'auth_user', 'users_matriculeautorise']
    for table in important_tables:
        if table in [t[0] for t in tables]:
            print(f"\n   📦 Table: {table}")
            cursor.execute(f"SELECT * FROM {table} LIMIT 3;")
            rows = cursor.fetchall()
            cursor.execute(f"PRAGMA table_info({table});")
            columns = [col[1] for col in cursor.fetchall()]
            
            for i, row in enumerate(rows):
                print(f"      Ligne {i+1}:")
                for col_name, value in zip(columns, row):
                    print(f"         {col_name}: {value}")
    
    conn.close()

if __name__ == "__main__":
    analyze_sqlite_structure()