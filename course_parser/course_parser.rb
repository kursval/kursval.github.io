require 'rubygems'
require 'nokogiri' 
require 'open-uri'
require 'set'
require 'json'



def find_all_specializations(node_tree)
	specializations = []
	
	node_tree.each do |node|
		special = Hash.new
		special['shortname'] = node.values.first.to_s
		special['fullname'] = node.content.to_s
		special['shortname'] = "V" if special['shortname'] == ""
		specializations.push(special)
	end

	return specializations
end

def get_special_nodes(html_doc)
	html_doc.xpath("//h3")
end

def get_specialization_nodeset(special_nodes)
	special_nodes.map do |node| 
		special_html = node.next_element.inner_html
		Nokogiri::HTML.parse(special_html)
	end
end

def parse_course_links(course_node)
	links = course_node.xpath("//td[starts-with(@class, 'pdf-avoidlinebreak')]//a")
	list = []
	links.each do |link|
		url = link['href'].to_s
		title = link['title'].to_s
		short_title = link.text.strip

		link = {}
		link['url'] = url
		link['type'] = short_title
		link['description'] = title
		list.push(link)
	end

	return list
end

def parse_studyperiod(course_node, should_parse_details=false)
	list = []
	data_nodes = course_node.xpath("//td[@class='bg_blue']//span[@class='ttinfo']")
	
	data_nodes.each do |data|
		data = Nokogiri::HTML.parse(data.inner_html)
		study_period = data.xpath("//strong").text.to_i
		details_key = data.xpath("//span[@class='pdf-noprint']//strong")
		details_key = details_key.map { |detail| detail.text }

		details_val = data.to_s.scan(/\d{1,3}<br>/)	
		details_val = details_val.map do |val| 
			val = val.gsub('<br>', '').to_i
		end

		details = details_key.zip(details_val)
		details = details.map { |x| x[1].nil? ? [x[0], 0] : x }

		object = {} 
		details.each do |detail|
			object[detail[0].to_sym] = detail[1]
		end
		
		list.push({study_period => object})
	end

	return list if should_parse_details
	only_sp = list.map { |e| e.map { |k,v| k } }
	return only_sp.flatten

end

def parse_course_name(course_node)
	node = course_node.xpath("//td[@width=250]")
	node.text.strip
end

def parse_basic_course_data(course_node, type)
	
	list = []
	nodes = course_node.xpath("//td")
	nodes.each { |node|	list.push(node.text.strip) }
	
	case type
	when "bachelor"
		map_course_data(list, 1)
	when "master"
		map_course_data(list, 4)
	when "elective"
		map_course_data(list, 3)
	end

end

def parse_all_courses(html_doc)
	special_nodes = get_special_nodes(html_doc)
	specials = find_all_specializations(special_nodes)

	specials_nodeset = get_specialization_nodeset(special_nodes)
	node_and_specialization = specials_nodeset.zip(specials)

	result = []

	node_and_specialization.each do |node,specialization|
		type = get_course_type(specialization)
		break if type == "degree project"
		courses = node.xpath("//tr")
		courses.shift

		courses.each do |course|
			course_node = Nokogiri::HTML(course.inner_html)
			the_course = create_course(course_node, type, specialization)
			result << the_course
		end
	end

	result = add_specials_to_courses(result)
	result = remove_duplicates(result)
	result = give_each_course_uniq_id(result)

	return result
end

def add_specials_to_courses(courses)
	courses.each do |curr_course|
		curr_name = curr_course['name']
		curr_specials = curr_course['specializations']
		courses.each do |other_course|
			other_name = other_course['name']
			other_specials = other_course['specializations']
			if curr_name == other_name
				other_specials.each do |other_sp|
					curr_specials << other_sp
				end
			end
		end
		curr_course['specializations'] = curr_specials.to_a
	end
end

def create_course(course_node, type, specialization)
	basics = parse_basic_course_data(course_node, type)
	links = parse_course_links(course_node)
	sp = parse_studyperiod(course_node)
	sp_details = parse_studyperiod(course_node, true)

	course = basics
	course['links'] = links
	course['sp'] = sp
	course['sp_details'] = sp_details
	course['on_hold'] = sp.length == 0

	special_set = Set.new
	special_set << specialization
	course['specializations'] = special_set

	course
end

private


def extract_footnote(text)
	text.gsub!(/^.*X{1}\s*/, '')
end

# Some basic course data is ignored, although it could easily be changed
def map_course_data(list, ignoreNumber)

	code = list.shift
	credits = list.shift.gsub(',', '.').to_f	
	cycle = list.shift
	ignoreNumber.times { list.shift }
	language = list.shift
	name = list.shift
	footnote = list.shift
	footnote = extract_footnote(footnote)

	{
		'code' => code,
		'credits' => credits,
		'cycle' => cycle,
		'language' => language,
		'name' => name,
		'footnote'	=> footnote
	}

end

def get_course_type(specialization)
	name = specialization['fullname']
	case name
	when /^Årskurs/
		"bachelor"
	when /^Study\sYear/
		"bachelor"
	when /^Specialisering/
		"master"
	when /^Specialisation/
		"master"
	when /^Valfria/
		"elective"
	when /^Elective/
		"elective"
	when /^Degree\sProjects/
		"degree project"
	when /^Examensarbeten/
		"degree project"
	end
end

def remove_duplicates(courses)
	courses.uniq do |c|
		code = c['code']
		sp = c['sp']
		footnote = c['footnote']
		credits = c['credits']
		cycle = c['cycle']
		code.to_s + sp.join(",") + footnote.to_s + credits.to_s + cycle.to_s
	end
end

def give_each_course_uniq_id(courses)
	i = 0;
	courses.each do |c|
		c['id'] = i
		i += 1
	end
end

#Main program starts here
#abort("Takes 3 arguments: program[D], study year[XX_XX], language[en, sv]") unless ARGV.length == 3
#program = ARGV[0]
#study_year = ARGV[1]
#language = ARGV[2]
#puts begin_parse(program, study_year, language)

def parse(program, study_year, language)

	url = "http://kurser.lth.se/lot/?lasar=" + study_year + "&sort1=lp&sort2=slut_lp&sort3=namn&prog=" + program + "&forenk=t&val=program&soek=t&lang=" +language;

	test = 'input.html' #will be removed later on...
	html_doc = Nokogiri::HTML(open(url))
	courses = parse_all_courses(html_doc)

	return JSON.pretty_generate courses

end


