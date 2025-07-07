#!/usr/bin/env python3
"""
Command-line script to run database seeders
"""

import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from seeds.northwind_seeder import NorthwindSeeder

def main():
    """Main function to run seeders"""
    print("🚀 Database Seeder Tool")
    print("=" * 40)
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("❌ .env file not found. Please create one with your database credentials.")
        return
    
    try:
        # Run Northwind seeder
        print("\n🌱 Running Northwind seeder...")
        seeder = NorthwindSeeder()
        seeder.seed()
        
        print("\n✅ All seeders completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Seeding failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 