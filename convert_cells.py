# Program to convert Life patterns in .cells files to format suitable for
# Gameoflife.js
# Varun Naik, March 2013

# To run, copy script to dir containing .lif files and run it.
# Converted patterns will be stored in out.js, copy and paste into gameoflife.js
# Options: Set max_width and max_height to ignore patterns larger than this
# Set them to false to read patterns of any size
import os

max_height = 15
max_width = 15

filenames = [name for name in os.listdir(".") if name.endswith(".cells")]
outfile = open(os.path.join(os.path.dirname(__file__), "out.js"), "w")
patternCount = 1
print (str(len(filenames)) + " files found.")
for filename in filenames:
	file = open(os.path.join(os.path.dirname(__file__), filename))
	lines = file.readlines()
	
	commentLines = 0
	name = "Unknown"
	for line in lines:
		if line[0] == "!":
			if line[1:5] == "Name":
				name = line[7:-1] #skip newline at end
			commentLines += 1
		else:
			break
		
	patternLines = len(lines) - commentLines
	
	if max_height != False and patternLines > max_height:
		continue
		
	width = max(len(line) for line in lines[commentLines:])
	
	if max_width != False and width > max_width:
		continue
		
	out = ""
	out += "\"" + str(patternCount) + "\":{width: " + str(width) + \
		", height: " + str(patternLines) + ", name: \"" + name + "\", pattern: \n{"
		
	lineCount = 0
	for line in lines[commentLines:]:
		col = 0
		res = "["
		for c in line:
			if c == 'O':
				res += ""+str(col)+","
			col += 1
		if res[-1] == ',':
			res = res[:-1] + "]"
			out += str(lineCount) + ": " + res + ", "
		lineCount += 1
		
	patternCount += 1
	out += "}},\n"
	outfile.write(out);
print (str(patternCount-1) + " patterns processed.")