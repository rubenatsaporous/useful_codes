var xhttp = new XMLHttpRequest();
var url = 'http://localhost:5500/html/usacannabisdirectory.html';

xhttp.onload = function() {
    var data = this.responseText;
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(data,"text/xml");
    var companies_data = [];

    var company_names = xmlDoc.querySelectorAll('div.h17');
    company_names.forEach((ele, index) => {
        var input = {};
        input.name = ele.textContent;
        companies_data.push(input);

        if(ele.nextSibling.classList.contains('h18')) {
            if (ele.nextSibling.textContent.lastIndexOf('phone:')>-1) {
                var start = ele.nextSibling.textContent.lastIndexOf('(');
                input.phone = ele.nextSibling.textContent.substring(start);
                if(ele.nextSibling.nextSibling.classList.contains('h18')) {
                    input.person = ele.nextSibling.nextSibling.textContent;
                    if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h19')) {
                        input.position = ele.nextSibling.nextSibling.nextSibling.textContent;
                        if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                            if(!ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_1 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                    if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                        input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                    }
                                } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        }
                    } else if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                        if(!ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.address_1 = ele.nextSibling.nextSibling.nextSibling.textContent;
                            if(ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        } else {
                            input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    }
                } else if (ele.nextSibling.nextSibling.classList.contains('h19')) {
                    input.position = ele.nextSibling.nextSibling.textContent;
                    if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                        if(!ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.address_1 = ele.nextSibling.nextSibling.nextSibling.textContent;
                            if(ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        } else {
                            input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    }
                } else if (ele.nextSibling.nextSibling.classList.contains('h1a')) {
                    if(!ele.nextSibling.nextSibling.textContent.includes('web:')) {
                        input.address_1 = ele.nextSibling.nextSibling.textContent;
                        if(ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.address_2 = ele.nextSibling.nextSibling.nextSibling.textContent;
                            if(ele.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        } else if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    } else {
                        input.website = ele.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                    }
                }
            } else {
                input.person = ele.nextSibling.textContent;
                if (ele.nextSibling.nextSibling.classList.contains('h19')) {
                    input.position = ele.nextSibling.nextSibling.textContent;
                    if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                        if(!ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.address_1 = ele.nextSibling.nextSibling.nextSibling.textContent;
                            if(ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        } else {
                            input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    }
                } else if (ele.nextSibling.nextSibling.classList.contains('h1a')) {
                    if(!ele.nextSibling.nextSibling.textContent.includes('web:')) {
                        input.address_1 = ele.nextSibling.nextSibling.textContent;
                        if(ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.address_2 = ele.nextSibling.nextSibling.nextSibling.textContent;
                            if(ele.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        } else if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    } else {
                        input.website = ele.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                    }
                }
            }
        } else if (ele.nextSibling.classList.contains('h19')) {
            input.position = ele.nextSibling.textContent;
            if (ele.nextSibling.nextSibling.classList.contains('h1a')) {
                if(!ele.nextSibling.nextSibling.textContent.includes('web:')) {
                    input.address_1 = ele.nextSibling.nextSibling.textContent;
                    if(ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                        input.address_2 = ele.nextSibling.nextSibling.nextSibling.textContent;
                        if(ele.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    } else if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                        input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                    }
                } else {
                    input.website = ele.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                }
            }
        } else if (ele.nextSibling.classList.contains('h1a')) {
            if(!ele.nextSibling.textContent.includes('web:')) {
                input.address_1 = ele.nextSibling.textContent;
                if(ele.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.textContent.includes('web:')) {
                    input.address_2 = ele.nextSibling.nextSibling.textContent;
                    if(ele.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                        input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                    }
                } else if (ele.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.textContent.includes('web:')) {
                    input.website = ele.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                }
            } else {
                input.website = ele.nextSibling.textContent.substring(5).replace(' ', '');
            }
        } else if (ele.nextSibling.classList.contains('h17')) {
            input.name += ele.nextSibling.textContent;
            if(ele.nextSibling.nextSibling.classList.contains('h18')) {
                if (ele.nextSibling.nextSibling.textContent.lastIndexOf('phone:')>-1) {
                    var start = ele.nextSibling.nextSibling.textContent.lastIndexOf('(');
                    input.phone = ele.nextSibling.nextSibling.textContent.substring(start);
                    if(ele.nextSibling.nextSibling.nextSibling.classList.contains('h18')) {
                        input.person = ele.nextSibling.nextSibling.nextSibling.textContent;
                        if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h19')) {
                            input.position = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                            if (ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                                if(!ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.address_1 = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                    if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                        input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                        if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                            input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                        }
                                    } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                        input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                    }
                                } else {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            }
                        } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                            if(!ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_1 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                    if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                        input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                    }
                                } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        }
                    } else if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h19')) {
                        input.position = ele.nextSibling.nextSibling.nextSibling.textContent;
                        if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                            if(!ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_1 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                    if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                        input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                    }
                                } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        }
                    } else if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                        if(!ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.address_1 = ele.nextSibling.nextSibling.nextSibling.textContent;
                            if(ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        } else {
                            input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    }
                } else {
                    input.person = ele.nextSibling.nextSibling.textContent;
                    if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h19')) {
                        input.position = ele.nextSibling.nextSibling.nextSibling.textContent;
                        if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                            if(!ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_1 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                    if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                        input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                    }
                                } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        }
                    } else if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                        if(!ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.address_1 = ele.nextSibling.nextSibling.nextSibling.textContent;
                            if(ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                                if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                    input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                                }
                            } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        } else {
                            input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    }
                }
            } else if (ele.nextSibling.nextSibling.classList.contains('h19')) {
                input.position = ele.nextSibling.nextSibling.textContent;
                if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a')) {
                    if(!ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                        input.address_1 = ele.nextSibling.nextSibling.nextSibling.textContent;
                        if(ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.address_2 = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                            if(ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                                input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                            }
                        } else if (ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    } else {
                        input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                    }
                }
            } else if (ele.nextSibling.nextSibling.classList.contains('h1a')) {
                if(!ele.nextSibling.nextSibling.textContent.includes('web:')) {
                    input.address_1 = ele.nextSibling.nextSibling.textContent;
                    if(ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && !ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                        input.address_2 = ele.nextSibling.nextSibling.nextSibling.textContent;
                        if(ele.nextSibling.nextSibling.nextSibling.nextSibling && ele.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                            input.website = ele.nextSibling.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                        }
                    } else if (ele.nextSibling.nextSibling.nextSibling.classList.contains('h1a') && ele.nextSibling.nextSibling.nextSibling.textContent.includes('web:')) {
                        input.website = ele.nextSibling.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                    }
                } else {
                    input.website = ele.nextSibling.nextSibling.textContent.substring(5).replace(' ', '');
                }
            }
        }
    });

    var companies_data_array = [];
    companies_data.forEach(company => {
        companies_data_array.push([
            company.name !== undefined ? company.name : 'nothing',
            company.phone !== undefined ? company.phone : 'nothing',
            company.person !== undefined ? company.person : 'nothing',
            company.position !== undefined ? company.position : 'nothing',
            company.address_1 !== undefined ? company.address_1 : 'nothing',
            company.address_2 !== undefined ? company.address_2 : 'nothing',
            company.website !== undefined ? company.website : 'nothing'
        ])
    })
    var csvContent = companies_data_array.map(e => e.join("^")).join("\n");
    console.log(csvContent);
};

xhttp.open('GET', url, true);
xhttp.send();