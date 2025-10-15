import sys
import os
import pandas

remove_columns = ["Original Title", "Illustrator", "Narrator", "Translator", "Photographer", "Editor", "Place of Publication", 
       "Favorites", "Rating", "Physical Location", "Status",
       "Status Incompleted Reason", "Status Hidden", "Date Started",
       "Date Finished", "Current Page", "Loaned To", "Date Loaned",
       "Borrowed From", "Date Borrowed", "Returned from Borrow",
       "Not Owned Reason", "Quantity", "Condition", "Recommended By",
        "User Supplied ID", "User Supplied Descriptor", "Tags",
       "Purchase Date", "Purchase Place", "Purchase Price", "Notes",
       "Google VolumeID", "Category", "Wish List", "Previously Owned",
       "Up Next", "Position", "Uploaded Image URL", "Activities", "Guided Reading Level", "Lexile Measure",
       "Lexile Code", "Grade Level Equivalent",
       "Developmental Reading Assessment", "Interest Level", "AR Level",
       "AR Points", "AR Quiz Number", "Format",
       "Audio Runtime", "Dimensions", "Weight", "List Price", "Language",
       "Original Language", "DDC", "LCC", "LCCN", "OCLC", "ISSN"
    ]
def main():
    args = sys.argv
    validate_args(args)
    library = pandas.read_csv(args[1])
    print("Columns before removal", library.columns, "Num Columns", len(library.columns))
    for col in remove_columns:
        library.pop(col)
    
    print("Columns after removal", library.columns, "Num Columns", len(library.columns))
    library.to_csv("docs/data/library.csv") # TODO change this to arg?

def validate_args(args):
    if len(args) != 2:
        raise ValueError("Incorrect Arguments: please provide single argument")
    
    if not os.path.isfile(args[1]):
        raise ValueError("Incorrect Arguments: arguments must be a valid filepath")

if __name__ == "__main__":
    main()